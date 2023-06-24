DROP FUNCTION IF EXISTS upsert_document;

CREATE OR REPLACE FUNCTION upsert_document(document_id_input text DEFAULT NULL, document_name_input text DEFAULT NULL, source_path_input text DEFAULT NULL, source_type_input text DEFAULT NULL)
	RETURNS json
	LANGUAGE PLPGSQL
	AS $$
DECLARE
	found_document_id text;
    insert_data tbl_document_versions;
	return_data json;
BEGIN
	IF document_id_input IS NULL THEN
		INSERT INTO tbl_documents(
			document_name,
			source_path,
			source_type)
		VALUES (
			document_name_input,
			source_path_input,
			source_type_input)
	RETURNING
		document_id INTO found_document_id;
	ELSE
		found_document_id := document_id_input;
	END IF;
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
				document_id = found_document_id), TRUE) RETURNING * INTO insert_data;
	--
	--
	RETURN json_build_object('document_id', insert_data.document_id, 'document_version', insert_data.document_version);
END;
$$;

