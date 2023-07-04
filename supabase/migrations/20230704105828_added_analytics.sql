alter table "public"."tbl_views" drop constraint "tbl_views_link_id_fkey";

alter table "public"."tbl_links" alter column "link_id" set not null;

alter table "public"."tbl_views" alter column "view_id" set not null;

alter table "public"."tbl_views" alter column "viewed_at" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_views(document_id_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	return_data json;
BEGIN
	SELECT
		row_to_json(t)
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
						WHERE
							tbl_links.link_id = tbl_views.link_id
							AND tbl_document_versions.document_id = document_id_input GROUP BY tbl_views. view_seq, tbl_views.view_id, tbl_document_versions.page_count) AS sub_views), '[]') AS views
			FROM tbl_links
			WHERE
				tbl_links.document_id = tbl_documents.document_id) AS sub), '[]') AS links
		FROM
			tbl_documents
		WHERE
			tbl_documents.document_id = document_id_input
		GROUP BY
			tbl_documents.document_id,
			tbl_documents.created_at,
			tbl_documents.created_by,
			tbl_documents.document_name,
			tbl_documents.document_seq,
			tbl_documents.is_enabled,
			tbl_documents.source_type,
			tbl_documents.source_path) t INTO return_data;
	--
	--
	RETURN return_data;
END;
$function$
;


