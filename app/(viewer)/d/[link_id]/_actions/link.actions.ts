'use server';
import { generateRandomString } from '@/app/_utils/common';
import {
    createServerComponentClient,
    supabaseAdminClient,
} from '@/app/_utils/supabase';
import { LinkViewType } from '@/types';
import disposableEmailDetector from 'disposable-email-detector';
import { cookies } from 'next/headers';

export const getLink = async ({ link_id }: { link_id: string }) => {
  const supabase = createServerComponentClient({ cookies: cookies() });

  const { data, error } = await supabase
    .rpc('get_link_props', { link_id_input: link_id })
    .returns<LinkViewType | null>();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
};

async function getSignedURL({ link }: { link: LinkViewType }) {
  const supabase = supabaseAdminClient();

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(
      `${link.org_id}/${link.document_id}/${link.document_version}.pdf`,
      3600
    );

  if (error || !data) return null;

  const { signedUrl } = data;

  return signedUrl;
}

export async function getDownloadUrl({ link_id }: { link_id: string }) {
  const link = await getLink({ link_id });

  const supabase = supabaseAdminClient();

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(
      `${link?.org_id}/${link?.document_id}/${link?.document_version}.pdf`,
      60,
      {
        download: link?.source_path ?? undefined,
      }
    );

  if (error || !data || !data.signedUrl) {
    console.error(error);
    return null;
  }

  return data.signedUrl;
}

export async function authorizeViewer({
  link_id,
  email,
  password,
  ip,
  geo,
  ua,
}: {
  link_id: string;
  email?: string;
  password?: string;
  ip?: string;
  geo?: string;
  ua?: any;
}) {
  try {
    const supabase = supabaseAdminClient();

    const link = await getLink({ link_id });

    if (!link) {
      throw new Error('Invalid link');
    }

    const { data: insert_view, error: insert_view_error } = await supabase
      .from('tbl_views')
      .insert({
        link_id: link.link_id,
        org_id: link.org_id,
        document_id: link.document_id,
        document_version: link.document_version,
        view_id: `${link.link_id}-${generateRandomString(6)}`,
        viewer: email && email.length > 0 ? email : 'Anonymous',
        ip: ip,
        geo: geo,
        ua: ua,
        is_authorized: false,
      })
      .select('view_id')
      .maybeSingle();

    if (insert_view_error || !insert_view) {
      console.error(insert_view_error);
      throw new Error(
        'Authorization failed. Please contact the owner of the document'
      );
    }

    // Check if the link is enabled and active

    const { is_enabled, is_active } = link;

    if (!is_enabled || !is_active) {
      throw new Error(
        'Invalid or inactive link. Please contact the owner of the document'
      );
    }

    // Check for expiration

    const { is_expiration_enabled, expiration_date } = link;

    if (is_expiration_enabled && expiration_date) {
      const expiration_date_obj = new Date(expiration_date);

      if (new Date() > expiration_date_obj) {
        throw new Error(
          'This link has expired. Please contact the owner of the document'
        );
      }
    }

    // Check if the email is valid

    const { is_email_required } = link;

    if (is_email_required) {
      if (!email) {
        throw new Error('Email is required');
      }

      // Check if the email is disposable

      const is_disposable_email = await disposableEmailDetector(email);

      if (is_disposable_email) {
        throw new Error('Disposable emails are not allowed');
      }

      // Check if the email is authorized

      if (link.is_domain_restricted && link.restricted_domains) {
        const domain = email.toLowerCase().split('@')[1];

        const domains_list = link.restricted_domains.toLowerCase().split(',');

        if (
          !domains_list.some((part) => {
            if (part.includes('@')) {
              return part === domain;
            }
            return domain.includes(part);
          })
        ) {
          throw new Error('Unauthorized email domain');
        }
      }
    }

    // Check if the password is required

    const { is_password_required, link_password } = link;

    if (is_password_required) {
      if (!password) {
        throw new Error('Password is required');
      }

      // Check if the password is valid

      if (password !== link_password) {
        throw new Error('Invalid password');
      }
    }

    // Update the view record
    const { error: update_view_error } = await supabase
      .from('tbl_views')
      .update({
        is_authorized: true,
      }).eq('view_id', insert_view.view_id);

    if (update_view_error) {
      throw new Error('Authorization failed. Please try again');
    }

    // Generate the signed URL
    const signed_url = await getSignedURL({ link });

    return { data: signed_url, error: null };
  } catch (error: any) {
    return { data: null, error: error?.message };
  }
}
