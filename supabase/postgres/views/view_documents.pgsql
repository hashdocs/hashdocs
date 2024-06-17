DROP VIEW IF EXISTS view_documents;

CREATE OR REPLACE VIEW view_documents WITH (security_invoker) AS WITH links AS (
        SELECT document_id,
            COUNT(*) AS total_links_count,
            COUNT(
                CASE
                    WHEN is_active = TRUE THEN 1
                END
            ) AS active_links_count
        FROM tbl_links
        GROUP BY document_id
    ),
    views AS (
        SELECT document_id,
            COUNT(*) AS total_views_count
        FROM tbl_views
        GROUP BY document_id
    )
SELECT tbl_documents.*,
    tbl_document_versions.document_version,
    tbl_document_versions.is_active,
    tbl_document_versions.page_count,
    tbl_document_versions.updated_at,
    tbl_document_versions.updated_by,
    tbl_document_versions.thumbnail_image,
    tbl_document_versions.token,
    COALESCE(links.total_links_count, 0) AS total_links_count,
    COALESCE(links.active_links_count,0) AS active_links_count,
    COALESCE(views.total_views_count,0) AS total_views_count
FROM tbl_documents
    LEFT JOIN tbl_document_versions ON tbl_documents.document_id = tbl_document_versions.document_id AND tbl_document_versions.is_active = TRUE
    LEFT JOIN links ON tbl_documents.document_id = links.document_id
    LEFT JOIN views ON tbl_documents.document_id = views.document_id;