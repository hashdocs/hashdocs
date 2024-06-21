set check_function_bodies = off
CREATE OR REPLACE FUNCTION public.get_documents(document_id_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	return_data json;
	time_input timestamptz;
	jwt_secret text;
BEGIN
	--
	--
	time_input = now();
	--
	--
	SELECT
		coalesce(current_setting('app.settings.jwt_secret', TRUE), 'super-secret-jwt-token-with-at-least-32-characters-long') INTO jwt_secret;
	--
	--
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
							tbl_links.link_id = tbl_views.link_id GROUP BY tbl_views. view_seq, tbl_views.view_id, tbl_document_versions.page_count ORDER BY tbl_views.view_seq DESC) sub_views), '[]') AS views
			FROM tbl_links
			WHERE
				tbl_links.document_id = tbl_documents.document_id) sub), '[]') AS links,
			coalesce((
				SELECT
					json_agg(row_to_json(sub_versions.*))
				FROM (
					SELECT
						tbl_document_versions.*, sign(json_build_object('url', 'documents/' || tbl_document_versions.document_id || '/' || tbl_document_versions.document_version || '.pdf', 'iat', ROUND(extract(epoch FROM time_input)), 'exp', ROUND(extract(epoch FROM time_input)) + 60 * 60 * 7 * 24), jwt_secret) AS token
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
$function$
CREATE OR REPLACE FUNCTION public.get_org(org_id_input uuid DEFAULT NULL::uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
DECLARE
	found_org_id uuid;
	return_data json;
BEGIN
	--
	--
	IF (org_id_input IS NOT NULL) THEN
		IF (auth.jwt() ->> 'role' <> 'service_role') THEN
			RAISE EXCEPTION 'Invalid credentials';
		END IF;
	END IF;
		--
		--
		found_org_id := COALESCE(list_org_from_user(), org_id_input);
		--
		--
		IF (found_org_id IS NULL) THEN
			RAISE EXCEPTION 'No org found';
		END IF;
		--
		--
		WITH members AS (
			SELECT
                org_member_seq,
				org_id,
				email,
				user_id,
				user_role
			FROM
				tbl_org_members
			LEFT JOIN auth.users ON tbl_org_members.user_id = auth.users.id
		WHERE
			org_id = found_org_id
)
	SELECT
		row_to_json(t)
	FROM (
		SELECT
			tbl_org.org_id,
			tbl_org.org_name,
			tbl_org.stripe_price_plan,
			tbl_org.stripe_product_plan,
			tbl_org.stripe_customer_id,
			tbl_org.subscription_status,
			tbl_org.billing_cycle_start,
			tbl_org.billing_cycle_end,
			ARRAY (
				SELECT
					row_to_json(members.*)
				FROM
					members
				WHERE
					members.org_id = tbl_org.org_id ORDER BY org_member_seq) AS users
			FROM
				tbl_org
			LEFT JOIN members ON tbl_org.org_id = members.org_id
		WHERE
			tbl_org.org_id = found_org_id) t INTO return_data;
		--
		--
		RETURN return_data;
END;
$function$