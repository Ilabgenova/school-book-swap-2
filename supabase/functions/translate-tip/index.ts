import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

type Tip = {
  id: string;
  submitted_by_user_id: string;
  original_language: string | null;
  activity_opportunity_name: string;
  brief_description: string;
  personal_feedback: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function translate(tip: Tip) {
  const source = (tip.original_language ?? "it").toLowerCase() === "en" ? "en" : "it";
  const target = source === "it" ? "en" : "it";
  const targetName = target === "en" ? "English" : "Italian";

  const prompt = `Translate the following school community recommendation fields into ${targetName}.
Rules: keep proper nouns, brand names, provider names, URLs, emails and phone numbers unchanged. Keep a natural, warm parent-to-parent tone. Do not add or remove information.

Return strictly this JSON object shape:
{"activity_name":"...","brief_description":"...","personal_feedback":"..."}

Fields:
activity_name: ${tip.activity_opportunity_name}
brief_description: ${tip.brief_description}
personal_feedback: ${tip.personal_feedback}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a precise IT<->EN translator. Reply with JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`AI gateway failed [${res.status}]: ${details}`);
  }

  const payload = await res.json();
  const raw: string = payload?.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    target,
    activity_name: String(parsed.activity_name ?? "").trim(),
    brief_description: String(parsed.brief_description ?? "").trim(),
    personal_feedback: String(parsed.personal_feedback ?? "").trim(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY is not configured" }, 500);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userRes } = await admin.auth.getUser(token);
    const user = userRes?.user;
    if (!user) return json({ error: "Not authenticated" }, 401);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = Boolean(roleRow);

    const body = await req.json().catch(() => ({}));
    const tipId: string | undefined = body?.tip_id;
    const backfill: boolean = body?.backfill === true;

    let tips: Tip[] = [];
    if (tipId) {
      const { data, error } = await admin
        .from("parent_community_tips")
        .select("id, submitted_by_user_id, original_language, activity_opportunity_name, brief_description, personal_feedback")
        .eq("id", tipId)
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      if (!data) return json({ error: "Tip not found" }, 404);
      if (!isAdmin && data.submitted_by_user_id !== user.id) return json({ error: "Forbidden" }, 403);
      tips = [data as Tip];
    } else if (backfill) {
      if (!isAdmin) return json({ error: "Admins only" }, 403);
      const { data, error } = await admin
        .from("parent_community_tips")
        .select("id, submitted_by_user_id, original_language, activity_opportunity_name, brief_description, personal_feedback")
        .neq("translation_status", "ready")
        .limit(25);
      if (error) return json({ error: error.message }, 500);
      tips = (data ?? []) as Tip[];
    } else {
      return json({ error: "tip_id or backfill required" }, 400);
    }

    const results: { id: string; ok: boolean; error?: string }[] = [];
    for (const tip of tips) {
      try {
        const t = await translate(tip);
        const source = (tip.original_language ?? "it").toLowerCase() === "en" ? "en" : "it";
        const update: Record<string, unknown> = {
          translation_status: "ready",
          translated_at: new Date().toISOString(),
          [`activity_name_${source}`]: tip.activity_opportunity_name,
          [`brief_description_${source}`]: tip.brief_description,
          [`personal_feedback_${source}`]: tip.personal_feedback,
          [`activity_name_${t.target}`]: t.activity_name,
          [`brief_description_${t.target}`]: t.brief_description,
          [`personal_feedback_${t.target}`]: t.personal_feedback,
        };
        const { error } = await admin.from("parent_community_tips").update(update).eq("id", tip.id);
        if (error) throw new Error(error.message);
        results.push({ id: tip.id, ok: true });
      } catch (e) {
        console.error("translate-tip failed", tip.id, e);
        results.push({ id: tip.id, ok: false, error: e instanceof Error ? e.message : String(e) });
      }
    }

    return json({ processed: results.length, results });
  } catch (e) {
    console.error("translate-tip error", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
