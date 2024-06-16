'use server';

import { createServerComponentClient } from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getOrg() {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data: org, error } = await supabase
    .rpc('get_org')
    .returns<OrgType[]>();

  if (!org || error) {
    await supabase.auth.signOut();
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  }

  return org;
}
