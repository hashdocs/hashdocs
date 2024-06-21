CREATE OR REPLACE FUNCTION get_document(document_id_input text)
RETURNS json
LANGUAGE PLPGSQL
AS $$
DECLARE
    return_data json;
BEGIN
    --
    --
    SELECT
        row_to_json(t) INTO return_data
    FROM (
        SELECT
            view_documents.*,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(a.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        tbl_links
                    WHERE 
                        tbl_links.document_id = document_id_input
                    ORDER BY
                        tbl_links.created_at DESC
                ) a
            ) AS links,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(b.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        tbl_document_versions
                    WHERE 
                        tbl_document_versions.document_id = document_id_input
                    ORDER BY
                        tbl_document_versions.updated_at DESC
                ) b
            ) AS versions,
            (
                SELECT
                    COALESCE(json_agg(row_to_json(c.*)), '[]'::json)
                FROM (
                    SELECT
                        * 
                    FROM 
                        view_logs
                    WHERE 
                        view_logs.document_id = document_id_input
                ) c
            ) AS views
        FROM
            view_documents
        WHERE
            view_documents.document_id = document_id_input
    ) t;
    --
    --
    RETURN return_data;
END;
$$;