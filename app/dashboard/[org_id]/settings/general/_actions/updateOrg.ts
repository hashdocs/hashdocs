'use server';

import { createServerActionClient } from '@/app/_utils/supabase';
import { randomInt } from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const updateOrg = async (form: FormData) => {
  const cookiesStore = cookies();
  const supabase = createServerActionClient({ cookies: cookiesStore });

  const org_image = form.get('org_image');
  const org_id = form.get('org_id')

  if (!org_id) throw new Error('org_id is required');

  let org_image_path: string | null = null;

  if ((org_image as File).size > 0) {
    const { data: upload_image, error: upload_image_error } =
      await supabase.storage
        .from('org')
        .upload(
          `${org_id}/org_image_${randomInt(1000)}`,
          org_image!,
          {
            upsert: true,
          }
        );

    if (upload_image_error) {
      console.error(upload_image_error);
      throw new Error(`Error occured in uploading image`, {
        cause: upload_image_error,
      });
    }

    org_image_path = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/org/${upload_image.path}`;

  }

  const data = {
    org_name: form.get('org_name')?.toString() || undefined,
    org_image: org_image_path || undefined,
  };

  const { error: update_org_error } = await supabase
    .from('tbl_org')
    .update({ ...data })
    .eq('org_id', org_id)
    .select()
    .single();

  if (update_org_error)
    throw new Error('Error occurred in updated org', {
      cause: update_org_error,
    });

  revalidatePath('/settings/general');
};
