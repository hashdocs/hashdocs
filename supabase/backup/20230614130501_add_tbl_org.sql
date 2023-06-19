CREATE TABLE "public"."tbl_org"(
	"org_id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"user_id" uuid,
	"role" text NOT NULL,
	"org_name" text
);

ALTER TABLE "public"."tbl_org" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tbl_documents"
	ALTER COLUMN "org_id" SET data TYPE uuid USING "org_id"::uuid;

CREATE UNIQUE INDEX tbl_org_pkey ON public.tbl_org USING btree(org_id);

ALTER TABLE "public"."tbl_org"
	ADD CONSTRAINT "tbl_org_pkey" PRIMARY KEY USING INDEX "tbl_org_pkey";

ALTER TABLE "public"."tbl_documents"
	ADD CONSTRAINT "tbl_documents_org_id_fkey" FOREIGN KEY (org_id) REFERENCES tbl_org(org_id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."tbl_documents" validate CONSTRAINT "tbl_documents_org_id_fkey";

ALTER TABLE "public"."tbl_org"
	ADD CONSTRAINT "tbl_org_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL NOT valid;

ALTER TABLE "public"."tbl_org" validate CONSTRAINT "tbl_org_user_id_fkey";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.list_org_from_user()
	RETURNS boolean
	LANGUAGE plpgsql
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
$function$;

CREATE POLICY "ALL if user org owns document" ON "public"."tbl_documents" AS permissive
	FOR ALL TO authenticated
		USING (list_org_from_user())
		WITH CHECK (list_org_from_user());

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO postgres;

