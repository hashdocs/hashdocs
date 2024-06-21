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
	SELECT
		row_to_json(t)
	FROM (
		SELECT
			*
		FROM
			tbl_links
		LEFT JOIN view_documents ON tbl_links.document_id = view_documents.document_id AND tbl_links.org_id = view_documents.org_id
	WHERE
		link_id = link_id_input) t INTO return_data;
	--
	--
	RETURN return_data;
END
$$;

