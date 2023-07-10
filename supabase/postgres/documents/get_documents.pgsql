CREATE OR REPLACE FUNCTION get_documents(document_id_input text DEFAULT NULL)
	RETURNS json
	LANGUAGE PLPGSQL
	AS $$
DECLARE
	return_data json;
BEGIN
	SELECT
		json_agg(row_to_json(t)) INTO return_data
	FROM (
		SELECT
			tbl_documents.*,
			coalesce((
				SELECT
					json_agg(row_to_json(sub.*))
				FROM (
					SELECT
						tbl_links.*, coalesce((
							SELECT
								json_agg(row_to_json(sub_views.*))
							FROM (
								SELECT
									tbl_views.*,(
										SELECT
											json_agg(row_to_json(v.*))
										FROM (
											SELECT
												tbl_view_logs.view_id, tbl_view_logs.page_num, coalesce(sum(tbl_view_logs.end_time - tbl_view_logs.start_time), 0) AS duration
											FROM tbl_view_logs
										WHERE
											tbl_views.view_id = tbl_view_logs.view_id GROUP BY tbl_view_logs.view_id, tbl_view_logs.page_num) v) AS view_logs, coalesce(round((count(DISTINCT tbl_view_logs.page_num)::float / tbl_document_versions.page_count * 100)::numeric), 0) AS completion, coalesce(sum(tbl_view_logs.end_time - tbl_view_logs.start_time), 0) AS duration, tbl_document_versions.page_count
							FROM tbl_views
							INNER JOIN tbl_view_logs ON tbl_links.link_id = tbl_views.link_id
								AND tbl_views.view_id = tbl_view_logs.view_id
							INNER JOIN tbl_document_versions ON tbl_views.document_version = tbl_document_versions.document_version
								AND tbl_document_versions.document_id = tbl_links.document_id
						WHERE
							tbl_links.link_id = tbl_views.link_id GROUP BY tbl_views. view_seq, tbl_views.view_id, tbl_document_versions.page_count) sub_views), '[]') AS views
			FROM tbl_links
			WHERE
				tbl_links.document_id = tbl_documents.document_id) sub), '[]') AS links,
			coalesce((
				SELECT
					json_agg(row_to_json(sub_versions.*))
				FROM (
					SELECT
						tbl_document_versions.*
					FROM tbl_document_versions
				WHERE
					tbl_document_versions.document_id = tbl_documents.document_id) AS sub_versions), '[]') AS versions
		FROM
			tbl_documents
		WHERE
			CASE WHEN document_id_input IS NULL THEN
				tbl_documents.org_id = list_org_from_user()
			ELSE
				tbl_documents.document_id = document_id_input
			END
		GROUP BY
			tbl_documents.document_id,
			tbl_documents.created_at,
			tbl_documents.created_by,
			tbl_documents.document_name,
			tbl_documents.document_seq,
			tbl_documents.is_enabled,
			tbl_documents.source_type,
			tbl_documents.source_path) t;
	--
	--
	RETURN coalesce(return_data, '[]'::json);
END;
$$;

