
UPDATE public.app_settings
   SET value = to_jsonb(3::numeric),
       updated_at = now()
 WHERE key = 'co2_kg_per_book';

INSERT INTO public.app_settings (key, value)
SELECT 'co2_kg_per_book', to_jsonb(3::numeric)
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'co2_kg_per_book');

-- Refresh cache used by public_get_co2_impact
SELECT private.refresh_co2_public_stats();
