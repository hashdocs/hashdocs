DROP FUNCTION IF EXISTS authorize_viewer;

CREATE OR REPLACE FUNCTION authorize_viewer(view_id_input text)
	RETURNS json
	LANGUAGE plpgsql
	AS $$
DECLARE
	return_data json;
	view_row RECORD;
	jwt_metadata json;
	time_input timestamptz;
	new_token text;
	jwt_secret text;
BEGIN
	--
	--
	IF (view_id_input IS NULL) THEN
		RAISE EXCEPTION 'Invalid view_id';
	END IF;
	--
	--
	UPDATE
		tbl_views
	SET
		is_authorized = sub.is_authorized,
		document_version = sub.document_version
	FROM (
		SELECT
			TRUE AS is_authorized,
			tbl_document_versions.document_version,
			tbl_documents.document_id
		FROM
			tbl_links
		LEFT JOIN tbl_views ON tbl_views.link_id = tbl_links.link_id
		LEFT JOIN tbl_documents ON tbl_links.document_id = tbl_documents.document_id
		LEFT JOIN tbl_document_versions ON tbl_document_versions.document_id = tbl_documents.document_id
	WHERE
		tbl_views.view_id = view_id_input
		AND tbl_documents.is_enabled = TRUE
		AND tbl_links.is_active = TRUE
		AND tbl_document_versions.is_enabled = TRUE
	LIMIT 1) sub
WHERE
	tbl_views.view_id = view_id_input
RETURNING
	* INTO view_row;
	--
	--
	IF (view_row IS NULL) THEN
		RAISE EXCEPTION 'Unauthorized view_id';
	END IF;
	--
	--
	time_input = now();
	--
	--
	jwt_metadata := json_build_object('aud', 'authenticated', 'iat', extract(epoch FROM time_input), 'exp', extract(epoch FROM time_input) + 60 * 60, 'role', 'authenticated', 'link_id', view_row.link_id, 'view_id', view_row.view_id, 'viewer', view_row.viewer, 'document_version', view_row.document_version, 'document_id', view_row.document_id);
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
	return_data = json_build_object('view_token', new_token);
	RETURN return_data;
END
$$;

