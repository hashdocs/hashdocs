alter table "public"."tbl_links" add column "expiration_date" timestamp with time zone;

alter table "public"."tbl_views" alter column "view_id" drop not null;


