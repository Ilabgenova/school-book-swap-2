
CREATE TABLE public.wanted_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  isbn TEXT,
  subject TEXT,
  program TEXT,
  class_year TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wanted_books TO authenticated;
GRANT ALL ON public.wanted_books TO service_role;

ALTER TABLE public.wanted_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view wanted books"
  ON public.wanted_books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add their own wanted books"
  ON public.wanted_books FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wanted books"
  ON public.wanted_books FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wanted books"
  ON public.wanted_books FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_wanted_books_updated_at
  BEFORE UPDATE ON public.wanted_books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX wanted_books_book_id_idx ON public.wanted_books(book_id);
