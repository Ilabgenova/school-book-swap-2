
CREATE TABLE public.bought_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_name TEXT,
  title TEXT NOT NULL,
  isbn TEXT,
  subject TEXT,
  program TEXT,
  class_year TEXT,
  acquisition_type TEXT NOT NULL DEFAULT 'bought',
  price_paid NUMERIC(10,2),
  date_bought DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bought_books TO authenticated;
GRANT ALL ON public.bought_books TO service_role;

ALTER TABLE public.bought_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bought books"
  ON public.bought_books FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bought books"
  ON public.bought_books FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bought books"
  ON public.bought_books FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bought books"
  ON public.bought_books FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_bought_books_user_id ON public.bought_books(user_id);
CREATE INDEX idx_bought_books_listing_id ON public.bought_books(listing_id);

CREATE TRIGGER update_bought_books_updated_at
  BEFORE UPDATE ON public.bought_books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
