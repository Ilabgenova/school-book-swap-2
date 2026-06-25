
CREATE POLICY "Listing photos viewable by authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'listing-photos');

CREATE POLICY "Sellers upload their own listing photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Sellers update their own listing photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Sellers delete their own listing photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
