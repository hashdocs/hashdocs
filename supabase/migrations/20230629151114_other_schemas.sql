CREATE POLICY "ALL for users 16v3daf_0" ON "storage"."objects" AS permissive
	FOR SELECT TO authenticated
		USING (((bucket_id = 'thumbnails'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "ALL for users 16v3daf_1" ON "storage"."objects" AS permissive
	FOR INSERT TO authenticated
		WITH CHECK (( (
		bucket_id = 'thumbnails' ::text) AND (
		auth.uid() IS NOT NULL)));

CREATE POLICY "ALL for users 16v3daf_2" ON "storage"."objects" AS permissive
	FOR UPDATE TO authenticated
		USING (((bucket_id = 'thumbnails'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "ALL for users 16v3daf_3" ON "storage"."objects" AS permissive
	FOR DELETE TO authenticated
		USING (((bucket_id = 'thumbnails'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "Get signed url for viewer flreew_0" ON "storage"."objects" AS permissive
	FOR SELECT TO authenticated
		USING (((bucket_id = 'documents'::text) AND (name =((((auth.jwt() ->> 'document_id'::text) || '/'::text) ||(auth.jwt() ->> 'document_version'::text)) || '.pdf'::text))));

CREATE POLICY "Upload documents for users flreew_0" ON "storage"."objects" AS permissive
	FOR SELECT TO authenticated
		USING (((bucket_id = 'documents'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "Upload documents for users flreew_1" ON "storage"."objects" AS permissive
	FOR INSERT TO authenticated
		WITH CHECK (( (
		bucket_id = 'documents' ::text) AND (
		auth.uid() IS NOT NULL)));

CREATE TRIGGER trigger_after_insert_auth_users
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION func_after_insert_auth_users();

