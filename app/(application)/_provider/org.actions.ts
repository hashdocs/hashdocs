'use server';

import {
  createServerComponentClient,
  supabaseAdminClient,
} from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getOrg() {
  try {
    const supabase = createServerComponentClient({ cookies: cookies() });
    const supabaseAdmin = supabaseAdminClient();
    let org_data: OrgType[] = [];

    const {
      data: { user },
      error: user_error,
    } = await supabase.auth.getUser();

    if (!user || user_error || !user.email) {
      throw user_error || new Error('User not found');
    }

    const { data: org, error: org_error } = await supabase
      .rpc('get_org')
      .returns<OrgType[]>();

    if (!org || org_error) {
      throw org_error || new Error('Org not found');
    }

    org_data = org;

    // If no org is found, create org
    if (!org_data.length) {
      const { data: insert_org, error: insert_error } = await supabaseAdmin
        .from('tbl_org')
        .insert({
          org_name: 'My Org',
        })
        .select('*')
        .maybeSingle();

      if (insert_error || !insert_org) {
        throw (
          insert_error || new Error(`Error inserting org - ${insert_error}`)
        );
      }

      const org_id = insert_org.org_id;

      const { data: _insert_member, error: insert_member_error } =
        await supabaseAdmin.from('tbl_org_members').insert({
          org_id: org_id,
          email: user.email,
          is_active: true,
          is_owner: true,
          member_name: user.user_metadata.name,
          user_id: user.id,
          member_image: user.user_metadata.avatar_url,
          role: 'admin',
        });

      if (insert_member_error) {
        throw (
          insert_member_error ||
          new Error(`Error inserting member - ${insert_member_error}`)
        );
      }

      const { data: new_org_data, error: org_error } = await supabase
        .rpc('get_org')
        .returns<OrgType[]>();

      if (org_error || !new_org_data) {
        throw new Error(`Error fetching org - ${org_error}`);
      }

      org_data = new_org_data;
    }

    return { org, user };
  } catch (error) {
    console.error('Error fetching org', error);
    redirect('/login');
  }
}
