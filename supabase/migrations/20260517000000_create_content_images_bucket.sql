-- Storage bucket for all content images (hotels, restaurants, surf shops, news).
-- Paths: /{table}/{record-id}/{filename}
-- Public read, authenticated write/update/delete.

INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "content-images: public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

CREATE POLICY "content-images: authenticated insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

CREATE POLICY "content-images: authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images');

CREATE POLICY "content-images: authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');
