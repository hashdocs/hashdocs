'use server';
import { createServerActionClient } from '@/app/_utils/supabase';
import { Enums, OrgType, Tables, TablesInsert, enum_colors } from '@/types';
import { cookies } from 'next/headers';

type InviteTeamParams = {
  email: string;
  role: Enums<'enum_member_role'>;
  org_id: string;
};

export const inviteTeam = async ({
  email,
  role,
  org_id,
}: InviteTeamParams): Promise<Tables<'tbl_org_members'> | null> => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({
      cookies: cookieStore,
    });

    const { data: org_data, error: org_error } = await supabase
      .rpc('get_org', { org_id_input: org_id })
      .returns<OrgType[]>();

    if (!org_data?.at(0) || org_error) {
      throw org_error;
    }

    const org = org_data[0];

    if (org.members.map((member) => member.email).includes(email)) {
      throw new Error('User already exists in the organization');
    }

    const newMemberData: TablesInsert<'tbl_org_members'> = {
      org_id: org.org_id,
      email: email.toLowerCase(),
      role: role,
      member_color: enum_colors[
        Math.floor(Math.random() * enum_colors.length)
      ] as Tables<'tbl_org_members'>['member_color'],
      invited_at: new Date().toISOString(),
      is_owner: false,
      is_active: true,
    };

    const { data: new_member, error: new_members_error } = await supabase
      .from('tbl_org_members')
      .insert(newMemberData)
      .select('*')
      .single();

    if (new_members_error) {
      throw new_members_error;
    }

    // try {
    //   const resend = new Resend(process.env.RESEND_API_KEY);

    //   await resend.emails.send({
    //     from: 'Periskope App <invite@periskope.app>',
    //     to: [new_member.email ?? ''],
    //     subject: 'You have been invited',
    //     html: InviteTemplate({ org_name: org.org_name ?? '' }),
    //   });
    // } catch (error: any) {
    //   throw (
    //     error || {
    //       type: 'INTERNAL_ERROR',
    //       message: error.message || 'Resend Error',
    //     }
    //   );
    // }

    return new_member;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const changeRole = async (
  {member, new_role}:{member: Tables<'tbl_org_members'>,
  new_role: Tables<'tbl_org_members'>['role'],}
) => {
  const cookiesStore = cookies();
  const supabase = createServerActionClient({ cookies: cookiesStore });

  if (member.is_owner) {
    throw new Error('Cannot change role of owner');
  }

  const { data: _org_member, error: org_member_error } = await supabase
    .from('tbl_org_members')
    .update({ role: new_role })
    .eq('email', member.email)
    .eq('org_id', member.org_id)
    .select()
    .single();

  if (org_member_error || !_org_member) {
    throw new Error('Error updating member role', { cause: org_member_error });
  }

  return _org_member;
};

export const deleteMember = async ({member}:{
  member: Tables<'tbl_org_members'>
}) => {
  const cookiesStore = cookies();
  const supabase = createServerActionClient({ cookies: cookiesStore });

  if (member.is_owner) {
    throw new Error('Cannot delete team owner');
  }

  const { data, error } = await supabase
    .from('tbl_org_members')
    .delete()
    .eq('email', member.email)
    .select();

  if (error) throw new Error('Error in removing member', { cause: error });
};
