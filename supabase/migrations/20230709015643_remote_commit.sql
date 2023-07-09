set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_viewer(view_id_input text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.func_before_insert_tbl_links()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    NEW.link_id := gen_links_id();
    RETURN NEW; 
END
$function$
;

CREATE OR REPLACE FUNCTION public.func_before_insert_tbl_views()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    NEW.view_id := gen_view_id(NEW.link_id);
    RETURN NEW; 
END
$function$
;

CREATE OR REPLACE FUNCTION public.gen_document_id(size integer DEFAULT 8, alphabet text DEFAULT 'abcdefghijklmnopqrstuvwxyz'::text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN
				LEFT (idBuilder,
					4) || '-' ||
			RIGHT (idBuilder,
				4);
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate document_id';
END
$function$
;

CREATE OR REPLACE FUNCTION public.gen_links_id(alphabet text DEFAULT 'abcdefghijklmnopqrstuvwxyz'::text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
	size int := 6;
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN idBuilder;
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate link_id';
END
$function$
;

CREATE OR REPLACE FUNCTION public.gen_view_id(link_id_input text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
	size int := 6;
	alphabet text := 'abcdefghijklmnopqrstuvwxyz';
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN link_id_input || '-' || idBuilder;
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;
	RAISE EXCEPTION 'Unexpected error: could not generate view_id';
END
$function$
;

CREATE OR REPLACE FUNCTION public.get_documents(document_id_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
			COALESCE(round((count(DISTINCT page_num)::float / page_count * 100)::numeric),0) AS completion
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
$function$
;

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

CREATE OR REPLACE FUNCTION public.upsert_document(document_id_input text DEFAULT NULL::text, document_name_input text DEFAULT NULL::text, source_path_input text DEFAULT NULL::text, source_type_input text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	found_document_id text;
	insert_data tbl_document_versions;
	return_data json;
BEGIN
	INSERT INTO tbl_documents(
		document_id,
		document_name,
		source_path,
		source_type)
	VALUES (
		coalesce(
			document_id_input, gen_document_id()),
		document_name_input,
		source_path_input,
		source_type_input)
ON CONFLICT (
	document_id)
	DO UPDATE SET
		source_path = EXCLUDED.source_path,
		source_type = EXCLUDED.source_type
	RETURNING
		document_id INTO found_document_id;
	--
	-- if found_document_id is null, then throw an error
	--
	IF found_document_id IS NULL THEN
		RAISE EXCEPTION 'Document not found';
	END IF;
	--
	-- update tbl_document_versions
	--
	UPDATE
		tbl_document_versions
	SET
		is_enabled = FALSE
	WHERE
		document_id = found_document_id;
	--
	-- insert new version
	--
	INSERT INTO tbl_document_versions(
		document_id,
		document_version,
		is_enabled)
	VALUES (
		found_document_id,
(
			SELECT
				coalesce(max(document_version), 0) + 1
			FROM
				tbl_document_versions
			WHERE
				document_id = found_document_id), TRUE)
RETURNING
	* INTO insert_data;
	--
	--
	SELECT
		get_documents(insert_data.document_id) INTO return_data;
	--
	--
	RETURN return_data;
END;
$function$
;


CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);

CREATE TRIGGER "slack-notification-new-user" AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://dblpeefwccpldqwuzwza.functions.supabase.co/trigger-slack-notification', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


create extension if not exists "wrappers" with schema "extensions";


