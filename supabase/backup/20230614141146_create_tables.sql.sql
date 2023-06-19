drop policy "ALL if user org owns document" on "public"."tbl_documents";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.list_org_from_user()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN (
		SELECT
			org_id
		FROM
			tbl_org
		WHERE
			user_id = auth.uid());
END
$function$
;

create policy "ALL if user org owns document"
on "public"."tbl_documents"
as permissive
for all
to authenticated
using ((org_id = list_org_from_user()))
with check ((org_id = list_org_from_user()));



