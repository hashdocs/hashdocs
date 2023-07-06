SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.gen_document_id(size integer DEFAULT 8, alphabet text DEFAULT 'abcdefghijklmnopqrstuvwxyz' ::text)
	RETURNS text
	LANGUAGE plpgsql
	AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN
				LEFT (idBuilder,
					4) || '-' ||
			RIGHT (idBuilder,
				4);
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate document_id';
END
$function$;

CREATE OR REPLACE FUNCTION public.gen_links_id(alphabet text DEFAULT 'abcdefghijklmnopqrstuvwxyz' ::text)
	RETURNS text
	LANGUAGE plpgsql
	AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
	size int := 6;
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN idBuilder;
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate link_id';
END
$function$;

CREATE OR REPLACE FUNCTION public.gen_view_id(link_id_input text)
	RETURNS text
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
	size int := 6;
	alphabet text := 'abcdefghijklmnopqrstuvwxyz';
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN link_id_input || '-' || idBuilder;
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate view_id';
END
$function$;

DROP POLICY "Upload documents for users flreew_0" ON "storage"."objects";

DROP POLICY "Upload documents for users flreew_1" ON "storage"."objects";

CREATE POLICY "ALL if user owns document flreew_0" ON "storage"."objects" AS permissive
	FOR SELECT TO authenticated
		USING (((bucket_id = 'documents'::text) AND (EXISTS (
			SELECT
				tbl_documents.document_id
			FROM
				tbl_documents
			WHERE (tbl_documents.document_id =(storage.foldername(objects.name))[1])))));

CREATE POLICY "ALL if user owns document flreew_1" ON "storage"."objects" AS permissive
	FOR INSERT TO authenticated
		WITH CHECK (( (
		bucket_id = 'documents' ::text) AND (
		EXISTS (
			SELECT
				tbl_documents.document_id
			FROM
				tbl_documents
			WHERE (tbl_documents.document_id =(storage.foldername(objects.name))[1])))));

CREATE POLICY "ALL if user owns document flreew_2" ON "storage"."objects" AS permissive
	FOR UPDATE TO authenticated
		USING (((bucket_id = 'documents'::text) AND (EXISTS (
			SELECT
				tbl_documents.document_id
			FROM
				tbl_documents
			WHERE (tbl_documents.document_id =(storage.foldername(objects.name))[1])))));

CREATE POLICY "ALL if user owns document flreew_3" ON "storage"."objects" AS permissive
	FOR DELETE TO authenticated
		USING (((bucket_id = 'documents'::text) AND (EXISTS (
			SELECT
				tbl_documents.document_id
			FROM
				tbl_documents
			WHERE (tbl_documents.document_id =(storage.foldername(objects.name))[1])))));

CREATE POLICY "Upload access to TEMP folder flreew_0" ON "storage"."objects" AS permissive
	FOR SELECT TO anon, authenticated
		USING (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = 'TEMP'::text)));

CREATE POLICY "Upload access to TEMP folder flreew_1" ON "storage"."objects" AS permissive
	FOR INSERT TO anon, authenticated
		WITH CHECK (( (
		bucket_id = 'documents' ::text) AND ((
		storage.foldername(
		name))[1] = 'TEMP' ::text)));

CREATE POLICY "Upload access to TEMP folder flreew_2" ON "storage"."objects" AS permissive
	FOR UPDATE TO anon, authenticated
		USING (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = 'TEMP'::text)));

