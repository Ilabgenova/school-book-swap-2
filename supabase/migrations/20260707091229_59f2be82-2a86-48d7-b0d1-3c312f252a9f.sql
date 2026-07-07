-- Reclassify existing keyboard / sphero listings into the new generic MYP category.
-- - Set item_type based on the title
-- - Move them out of a specific MYP class year into the "Generic MYP" pseudo-grade
-- - Point book_id at the corresponding synthetic entry so buyer views group them
UPDATE public.listings
SET item_type = 'sphero',
    class_year = 'Generic MYP',
    program = 'MYP',
    subject = 'Sphero Mini Robot',
    book_id = 'generic-sphero',
    isbn = NULL,
    updated_at = now()
WHERE title ~* '\ysphero\y';

UPDATE public.listings
SET item_type = 'keyboard',
    class_year = 'Generic MYP',
    program = 'MYP',
    subject = 'Keyboard',
    book_id = 'generic-keyboard',
    isbn = NULL,
    updated_at = now()
WHERE (title ~* '\ykeyboard\y' OR title ~* '\ytastiera\y')
  AND item_type <> 'sphero';