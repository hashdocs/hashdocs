'use server';

import {
  createServerComponentClient,
  supabaseAdminClient,
} from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getOrg() {
  const supabase = createServerComponentClient({ cookies: cookies() });
  try {
    const { data: org, error: org_error } = await supabase
      .rpc('get_org')
      .returns<OrgType[]>();

    if (!org || org_error) {
      throw org_error || new Error('Org not found');
    }

    return org;
  } catch (error) {
    await supabase.auth.signOut();
    redirect('/login');
  }
}

export async function createOrg() {
  const supabaseAdmin = supabaseAdminClient();
  const supabase = createServerComponentClient({ cookies: cookies() });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.email) {
    throw new Error('User email not found');
  }

  const { data: new_org_data, error: org_error } = await supabaseAdmin
    .rpc('create_org', {
      new_user_email: user.email,
    })
    .returns<string>();

  if (org_error || !new_org_data) {
    throw org_error ?? new Error(`Error creating org - ${org_error}`);
  }

  return new_org_data;
}

// export async function createOrg() {
//   const supabaseAdmin = supabaseAdminClient();
//   const supabase = createServerComponentClient({ cookies: cookies() });

//   const {
//     data: { session },
//   } = await supabase.auth.refreshSession();

//   if (!session || !session.user) {
//     throw new Error('User not found');
//   }

//   const user = session.user;

//   if (!user.email) {
//     throw new Error('User email not found');
//   }

//   const { data: orgData, error: orgDataError } = await supabase
//     .rpc('get_org')
//     .returns<OrgType[]>();

//   if (orgDataError) {
//     throw orgDataError;
//   }

//   if (
//     orgData &&
//     orgData.length > 0 &&
//     orgData.find((o) => o.org_plan == 'Free')
//   ) {
//     throw new Error(
//       'Only one org is allowed on the free plan. Please upgrade to create additional organizations'
//     );
//   }

//   // const org_name = !!user.user_metadata.name
//   //   ? `${user.user_metadata.name}'s Org`
//   //   : 'My Personal Org';

//   const org_name = 'My Org';

//   const { data: insert_org, error: insert_error } = await supabaseAdmin
//     .from('tbl_org')
//     .insert({
//       org_name,
//     })
//     .select('*')
//     .maybeSingle();

//   if (insert_error || !insert_org) {
//     throw insert_error || new Error(`Error inserting org - ${insert_error}`);
//   }

//   const org_id = insert_org.org_id;

//   const { data: _insert_member, error: insert_member_error } =
//     await supabaseAdmin.from('tbl_org_members').insert({
//       org_id,
//       email: user.email,
//       is_active: true,
//       is_owner: true,
//       member_name: user.user_metadata.name,
//       user_id: user.id,
//       member_image: user.user_metadata.avatar_url,
//       member_color: enum_colors[
//         Math.floor(Math.random() * enum_colors.length)
//       ] as Tables<'tbl_org_members'>['member_color'],
//       role: 'admin',
//     });

//   if (insert_member_error) {
//     throw (
//       insert_member_error ||
//       new Error(`Error inserting member - ${insert_member_error}`)
//     );
//   }

//   const { data: new_org_data, error: org_error } = await supabaseAdmin
//     .rpc('get_org', {
//       org_id_input: org_id,
//     })
//     .returns<OrgType[]>();

//   if (org_error || !new_org_data || !new_org_data.length) {
//     throw org_error ?? new Error(`Error fetching org - ${org_error}`);
//   }

//   await supabase.auth.refreshSession();

//   return new_org_data[0];
// }
