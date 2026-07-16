// handle-listing-action: public endpoint hit from the reminder email button.
// Verifies the token via consume_listing_action_token RPC and redirects to
// the frontend confirmation page with a status code.
import { createClient } from 'npm:@supabase/supabase-js@2'

const SITE_URL = 'https://www.disbook.it'

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function redirect(status: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ status, ...extra })
  return new Response(null, {
    status: 302,
    headers: { Location: `${SITE_URL}/listing-action/result?${params.toString()}` },
  })
}

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const action = url.searchParams.get('action') ?? ''

  if (!token || !/^[a-f0-9]{64}$/i.test(token) || !['still_available', 'mark_sold'].includes(action)) {
    return redirect('invalid')
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const hash = await sha256Hex(token)
  const { data, error } = await supabase.rpc('consume_listing_action_token', { _token_hash: hash })
  if (error) {
    console.error('consume_listing_action_token error', error)
    return redirect('error')
  }

  const result = data as { ok: boolean; code: string; listing_id?: string }
  if (!result?.ok) {
    return redirect(result?.code ?? 'invalid')
  }
  return redirect(result.code, result.listing_id ? { listing: result.listing_id } : {})
})
