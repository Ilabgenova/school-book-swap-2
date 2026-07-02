-- Revoke anonymous access to the listings RPC (get_active_listing_cards is browse-page data; auth-only)
REVOKE EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) FROM anon, PUBLIC;

-- Belt & suspenders: ensure anon has no direct access to any public table
-- (public schema is used for our application data; anon should never read tables directly)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;