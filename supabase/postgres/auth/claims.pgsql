-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
stable
as $$
  declare
    claims jsonb;
    org_ids uuid[];
  begin
    -- Fetch the user role in the user_roles table
    select COALESCE(array_agg(org_id), '{}') INTO org_ids from public.tbl_org_members where email = (SELECT email FROM auth.users WHERE id = (event->>'user_id')::uuid);

    claims := event->'claims';

      -- Check if 'app_metadata' exists in claims
      if jsonb_typeof(claims->'app_metadata') is null then
        -- If 'app_metadata' does not exist, create an empty object
        claims := jsonb_set(claims, '{app_metadata}', '{}');
      end if;

      -- Set a claim of 'org_ids'
      claims := jsonb_set(claims, '{app_metadata, org_ids}', to_jsonb(org_ids));

      -- Update the 'claims' object in the original event
      event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant all
  on table public.tbl_org_members
to supabase_auth_admin;

-- create policy "Allow auth admin to read user roles" ON public.tbl_org_members
-- as permissive for select
-- to supabase_auth_admin
-- using (true)