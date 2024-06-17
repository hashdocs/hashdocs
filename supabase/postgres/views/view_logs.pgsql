CREATE OR REPLACE VIEW view_logs WITH (security_invoker) AS
SELECT tbl_views.*,
    (
        SELECT jsonb_object_agg(v.page_num, v.duration)
        FROM (
                SELECT tbl_view_logs.page_num,
                    coalesce(
                        sum(
                            tbl_view_logs.end_time - tbl_view_logs.start_time
                        ),
                        0
                    ) AS duration
                FROM tbl_view_logs
                WHERE tbl_views.view_id = tbl_view_logs.view_id
                GROUP BY tbl_view_logs.page_num
            ) v
    ) AS view_logs,
    coalesce(
        round(
            (
                COUNT(DISTINCT tbl_view_logs.page_num)::float / tbl_document_versions.page_count * 100
            )::numeric
        ),
        0
    ) AS completion,
    coalesce(
        sum(
            tbl_view_logs.end_time - tbl_view_logs.start_time
        ),
        0
    ) AS duration,
    tbl_document_versions.page_count
FROM tbl_views
    LEFT JOIN tbl_view_logs ON tbl_view_logs.view_id = tbl_views.view_id
    AND tbl_view_logs.link_id = tbl_views.link_id
    AND tbl_view_logs.document_id = tbl_views.document_id
    AND tbl_view_logs.org_id = tbl_views.org_id
    INNER JOIN tbl_document_versions ON tbl_views.document_version = tbl_document_versions.document_version
    AND tbl_document_versions.document_id = tbl_views.document_id
    AND tbl_views.org_id = tbl_document_versions.org_id
GROUP BY tbl_views.view_id,
    tbl_views.org_id,
    tbl_views.document_id,
    tbl_views.link_id,
    tbl_document_versions.page_count