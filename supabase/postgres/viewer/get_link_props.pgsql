DROP FUNCTION IF EXISTS get_link_props;

CREATE OR REPLACE FUNCTION get_link_props(link_id_input text)
	RETURNS json
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $$
DECLARE
	return_data json;
BEGIN
	--
	--
	IF (link_id_input IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	SELECT
		row_to_json(t)
	FROM (
		SELECT
			*
		FROM
			tbl_links
		LEFT JOIN tbl_documents ON tbl_links.document_id = tbl_documents.document_id
		LEFT JOIN tbl_document_versions ON tbl_links.document_id = tbl_document_versions.document_id
	WHERE
		link_id = link_id_input
		AND tbl_documents.is_enabled = TRUE
		AND tbl_links.is_active = TRUE
		AND tbl_document_versions.is_enabled = TRUE) t INTO return_data;
	--
	--
	RETURN return_data;
END
$$;

