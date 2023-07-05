set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.upsert_document(document_id_input text DEFAULT NULL::text, document_name_input text DEFAULT NULL::text, source_path_input text DEFAULT NULL::text, source_type_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	found_document_id text;
	insert_data tbl_document_versions;
	return_data json;
BEGIN
	INSERT INTO tbl_documents(
		document_id,
		document_name,
		source_path,
		source_type)
	VALUES (
		coalesce(
			document_id_input, gen_document_id()),
		document_name_input,
		source_path_input,
		source_type_input)
ON CONFLICT (
	document_id)
	DO UPDATE SET
		source_path = EXCLUDED.source_path,
		source_type = EXCLUDED.source_type
	RETURNING
		document_id INTO found_document_id;
	--
	-- if found_document_id is null, then throw an error
	--
	IF found_document_id IS NULL THEN
		RAISE EXCEPTION 'Document not found';
	END IF;
	--
	-- update tbl_document_versions
	--
	UPDATE
		tbl_document_versions
	SET
		is_enabled = FALSE
	WHERE
		document_id = found_document_id;
	--
	-- insert new version
	--
	INSERT INTO tbl_document_versions(
		document_id,
		document_version,
		is_enabled)
	VALUES (
		found_document_id,
(
			SELECT
				coalesce(max(document_version), 0) + 1
			FROM
				tbl_document_versions
			WHERE
				document_id = found_document_id), TRUE)
RETURNING
	* INTO insert_data;
	--
	--
	SELECT
		get_documents(insert_data.document_id) INTO return_data;
	--
	--
	RETURN return_data;
END;
$function$
;


