DROP FUNCTION IF EXISTS authorize_viewer;

CREATE OR REPLACE FUNCTION authorize_viewer(link_id_input text, email_input text DEFAULT NULL)
	RETURNS json
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $$
DECLARE
	return_data json;
	link_props RECORD;
	view_row tbl_views;
	jwt_metadata json;
	time_input timestamptz;
	new_token text;
	jwt_secret text;
BEGIN
	--
	--
	IF (link_id_input IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	SELECT
		*
	FROM
		tbl_links
	LEFT JOIN tbl_documents ON tbl_links.document_id = tbl_documents.document_id
	LEFT JOIN tbl_document_versions ON tbl_documents.document_id = tbl_document_versions.document_id
WHERE
	link_id = link_id_input
		AND tbl_links.is_active = TRUE
		AND tbl_document_versions.is_enabled = TRUE
		AND tbl_documents.is_enabled = TRUE INTO link_props;
	--
	--
	IF (link_props IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	IF (link_props.is_enabled = FALSE OR link_props.is_active = FALSE) THEN
		RAISE EXCEPTION 'Link is disabled';
	END IF;
	--
	--
	INSERT INTO tbl_views(
		link_id,
		viewer,
		document_version)
	VALUES (
		link_props.link_id,
		email_input,
		link_props.document_version)
RETURNING
	* INTO view_row;
	--
	--
	IF (view_row IS NULL) THEN
		RAISE EXCEPTION 'Invalid link_id';
	END IF;
	--
	--
	time_input = now();
	--
	--
	jwt_metadata := json_build_object('aud', 'authenticated', 'iat', extract(epoch FROM time_input), 'exp', extract(epoch FROM time_input) + 60 * 60, 'role', 'authenticated', 'link_id', view_row.link_id, 'view_id', view_row.view_id, 'viewer', view_row.viewer, 'document_version', view_row.document_version, 'document_id', link_props.document_id);
	--
	--
	SELECT
		coalesce(current_setting('app.settings.jwt_secret', TRUE), 'super-secret-jwt-token-with-at-least-32-characters-long') INTO jwt_secret;
	--
	--
	SELECT
		sign(jwt_metadata, jwt_secret) INTO new_token;
	--
	--
	return_data = json_build_object('view_token', new_token, 'view', view_row);
	RETURN return_data;
END
$$;

