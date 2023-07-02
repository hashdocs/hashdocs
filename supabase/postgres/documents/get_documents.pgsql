DROP FUNCTION IF EXISTS get_documents;

CREATE OR REPLACE FUNCTION get_documents(document_id_input text DEFAULT NULL)
	RETURNS json
	LANGUAGE PLPGSQL
	AS $$
DECLARE
	return_data json;
BEGIN
	WITH views AS (
		SELECT
			tbl_views.view_seq,
			tbl_views.link_id,
			tbl_views.view_id,
			tbl_views.viewed_at,
			tbl_views.viewer,
			tbl_views.document_version,
			coalesce(sum(tbl_view_logs.end_time - tbl_view_logs.start_time), 0) AS duration,
			round((count(DISTINCT page_num)::float / page_count * 100)::numeric) AS completion
		FROM
			tbl_views
		LEFT JOIN tbl_view_logs ON tbl_views.view_id = tbl_view_logs.view_id
		LEFT JOIN tbl_links ON tbl_links.link_id = tbl_views.link_id
		LEFT JOIN tbl_document_versions ON tbl_document_versions.document_id = tbl_links.document_id
	WHERE
		tbl_views.document_version = tbl_document_versions.document_version
	GROUP BY
		tbl_views.view_seq,
		tbl_views.link_id,
		tbl_views.view_id,
		tbl_views.viewed_at,
		tbl_views.viewer,
		tbl_views.document_version,
		tbl_document_versions.page_count
),
links AS (
	SELECT
		tbl_links.link_seq,
		tbl_links.link_id,
		tbl_links.link_name,
		tbl_links.created_at,
		tbl_links.is_active,
		tbl_links.document_id,
		tbl_links.created_by,
		tbl_links.is_email_required,
		tbl_links.is_password_required,
		tbl_links.is_verification_required,
		tbl_links.is_domain_restricted,
		tbl_links.is_download_allowed,
		tbl_links.is_watermarked,
		tbl_links.restricted_domains,
		tbl_links.link_password,
		coalesce(count(DISTINCT views.view_id), 0) AS view_count,
		CASE WHEN count(DISTINCT views.view_id) = 0 THEN
			ARRAY[]::json[]
		ELSE
			ARRAY (
				SELECT
					row_to_json(views.*)
				FROM
					views
				WHERE
					views.link_id = tbl_links.link_id
				ORDER BY
					views.view_seq DESC)
		END AS views
	FROM
		tbl_links
		LEFT JOIN views ON views.link_id = tbl_links.link_id
	GROUP BY
		tbl_links.link_seq,
		tbl_links.link_id,
		tbl_links.link_name,
		tbl_links.created_at,
		tbl_links.is_active,
		tbl_links.document_id,
		tbl_links.created_by,
		tbl_links.is_email_required,
		tbl_links.is_password_required,
		tbl_links.is_verification_required,
		tbl_links.is_domain_restricted,
		tbl_links.is_download_allowed,
		tbl_links.is_watermarked,
		tbl_links.restricted_domains,
		tbl_links.link_password
	ORDER BY
		tbl_links.link_seq DESC
)
SELECT
	json_agg(row_to_json(t))
FROM (
	SELECT
		tbl_documents.document_seq,
		tbl_documents.document_id,
		tbl_documents.created_at,
		tbl_document_versions.created_at AS updated_at,
		tbl_documents.document_name,
		tbl_documents.source_path,
		tbl_documents.source_type,
		tbl_documents.created_by,
		tbl_documents.org_id,
		tbl_documents.is_enabled,
		tbl_documents.image,
		tbl_document_versions.document_version,
		coalesce(count(links.link_id), 0) AS total_links_count,
		coalesce(sum(links.view_count), 0) AS total_view_Count,
		CASE WHEN count(DISTINCT links.link_id) = 0 THEN
			ARRAY[]::json[]
		ELSE
			ARRAY (
				SELECT
					row_to_json(links.*)
				FROM
					links
				WHERE
					links.document_id = tbl_documents.document_id
				ORDER BY
					links.link_seq DESC)
		END AS links
	FROM
		tbl_documents
	LEFT JOIN links ON tbl_documents.document_id = links.document_id
	LEFT JOIN tbl_document_versions ON tbl_documents.document_id = tbl_document_versions.document_id
WHERE
	tbl_document_versions.is_enabled = TRUE
	AND CASE WHEN document_id_input IS NULL THEN
		tbl_documents.org_id = list_org_from_user()
	ELSE
		tbl_documents.document_id = document_id_input
	END
GROUP BY
	tbl_documents.document_seq,
	tbl_documents.document_id,
	tbl_documents.created_at,
	tbl_document_versions.created_at,
	tbl_documents.document_name,
	tbl_documents.source_path,
	tbl_documents.source_type,
	tbl_documents.created_by,
	tbl_documents.org_id,
	tbl_documents.is_enabled,
	tbl_documents.image,
	tbl_document_versions.document_version
ORDER BY
	tbl_documents.document_seq DESC) t INTO return_data;
	--
	--
	RETURN coalesce(return_data, '[]'::json);
END;
$$;

