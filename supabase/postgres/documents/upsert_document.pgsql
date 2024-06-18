DROP FUNCTION IF EXISTS upsert_document;

CREATE OR REPLACE FUNCTION upsert_document(org_id_input uuid, document_id_input text DEFAULT NULL, document_name_input text DEFAULT NULL, source_path_input text DEFAULT NULL, source_type_input text DEFAULT NULL)
	RETURNS json
	LANGUAGE PLPGSQL
	AS $$
DECLARE
	found_document_id text;
	document_count integer;
	return_data json;
BEGIN
	INSERT INTO tbl_documents(
		org_id,
		document_id,
		document_name,
		source_path,
		source_type)
	VALUES (
		org_id_input,
		coalesce(document_id_input, gen_document_id()),
		document_name_input,
		source_path_input,
		source_type_input)
ON CONFLICT (
	document_id)
	DO UPDATE SET
		source_path = EXCLUDED.source_path,
		source_type = EXCLUDED.source_type,
		document_name = EXCLUDED.document_name
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
		is_active = FALSE
	WHERE
		document_id = found_document_id
		AND org_id = org_id_input;
	--
	--
	SELECT 
		count(*) INTO document_count 
	FROM 
		tbl_document_versions 
	WHERE 
		document_id = found_document_id 
		AND org_id = org_id_input;
	--
	-- insert new version
	--
	INSERT INTO tbl_document_versions(
		org_id,
		document_id,
		document_version,
		is_active, 
		token)
	VALUES (
		org_id_input,
		found_document_id,
		COALESCE(document_count,0) + 1, 
		TRUE, 
		sign(json_build_object('url', 'documents/' || org_id_input || '/' || found_document_id || '/' || COALESCE(document_count,0) + 1 || '.pdf', 'iat', ROUND(extract(epoch FROM now())), 'exp', ROUND(extract(epoch FROM now())) + 60 * 60 * 7 * 24 * 52 * 20), current_setting('app.settings.jwt_secret', TRUE)));
	--
	--
	SELECT row_to_json(view_documents) INTO return_data FROM view_documents WHERE document_id = found_document_id AND org_id = org_id_input;
	--
	--
	RETURN return_data;
END;
$$;

