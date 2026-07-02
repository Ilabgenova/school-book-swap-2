-- Revoke anonymous access to listing RPC and notifications table
REVOKE EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) FROM PUBLIC;

-- Revoke all anon privileges from notifications (was granted SELECT/INSERT/UPDATE/DELETE)
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.notifications FROM anon;

-- Defensive: ensure anon has no privileges on other user-facing tables at table level
-- (RLS is not enough — table-level grants must also be scoped)
REVOKE ALL ON public.listings FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.conversations FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.transactions FROM anon;
REVOKE ALL ON public.user_ratings FROM anon;
REVOKE ALL ON public.bought_books FROM anon;
REVOKE ALL ON public.wanted_books FROM anon;
REVOKE ALL ON public.reports FROM anon;
REVOKE ALL ON public.user_moderation_log FROM anon;
REVOKE ALL ON public.profiles_private FROM anon;
REVOKE ALL ON public.book_imports FROM anon;
REVOKE ALL ON public.book_import_rows FROM anon;
REVOKE ALL ON public.book_catalog FROM anon;
REVOKE ALL ON public.amazon_links FROM anon;