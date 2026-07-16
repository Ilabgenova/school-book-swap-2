// send-listing-reminders: cron-triggered. Finds active listings older than 14 days,
// generates signed tokens, and enqueues a reminder email via send-transactional-email.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://www.disbook.it'
const ACTION_URL = 'https://tbhstqoixqhovzgjmmss.supabase.co/functions/v1/handle-listing-action'
const TOKEN_TTL_DAYS = 21

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
function randomToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return toHex(hash)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: rows, error } = await supabase.rpc('list_listings_needing_reminder', { _limit: 200 })
  if (error) {
    console.error('list_listings_needing_reminder failed', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  let sent = 0, failed = 0
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  for (const row of rows ?? []) {
    try {
      const tokStill = randomToken()
      const tokSold = randomToken()
      const hashStill = await sha256Hex(tokStill)
      const hashSold = await sha256Hex(tokSold)

      const { error: rpcErr } = await supabase.rpc('create_listing_reminder_tokens', {
        _listing_id: row.listing_id,
        _user_id: row.seller_id,
        _still_available_hash: hashStill,
        _mark_sold_hash: hashSold,
        _expires_at: expiresAt,
      })
      if (rpcErr) throw rpcErr

      const stillUrl = `${ACTION_URL}?token=${tokStill}&action=still_available`
      const soldUrl = `${ACTION_URL}?token=${tokSold}&action=mark_sold`

      const { error: emailErr } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'listing-reminder',
          recipientEmail: row.recipient_email,
          idempotencyKey: `listing-reminder-${row.listing_id}-${Date.now()}`,
          templateData: {
            bookTitle: row.title,
            stillAvailableUrl: stillUrl,
            markSoldUrl: soldUrl,
          },
        },
      })
      if (emailErr) throw emailErr
      sent++
    } catch (e) {
      failed++
      console.error('reminder failed for listing', row.listing_id, e)
      await supabase.from('listing_reminder_log').insert({
        listing_id: row.listing_id,
        user_id: row.seller_id,
        reminder_type: 'email',
        status: 'failed',
        error_message: String((e as Error)?.message ?? e),
      })
    }
  }

  return new Response(JSON.stringify({ ok: true, considered: rows?.length ?? 0, sent, failed }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
