'use server';
import { generateRandomString } from '@/app/_utils/common';
import {
  supabaseAdminClient
} from '@/app/_utils/supabase';
import { LinkViewType, TablesInsert, ViewCookieType } from '@/types';
import { cookies, headers } from 'next/headers';
import { userAgent } from 'next/server';

export const getLink = async ({ link_id }: { link_id: string }) => {
  const supabase = supabaseAdminClient();
  
  const { data, error } = await supabase
    .rpc('get_link_props', { link_id_input: link_id })
    .returns<LinkViewType | null>();

  if (error || !data) {
    console.error(`Error at getLink: ${error}`);
    return null;
  }

  return data;
};

export const getSignedURL = async ({
  org_id,
  document_id,
  document_version,
  link_id,
  download_file_name,
}: {
  org_id: string;
  document_id: string;
  document_version: number;
  link_id?: string;
  download_file_name?: string;
}) => {
  const supabase = supabaseAdminClient();

  let view_details: ViewCookieType | null = null;
  if (!!link_id) {
    const cookie_val = cookies().get('hashdocs');

    if (!cookie_val || !cookie_val.value) {
      return { signedUrl: null, view: null };
    }

    view_details = JSON.parse(cookie_val.value || '{}')?.[link_id];

    if (!view_details) {
      return { signedUrl: null, view: null };
    }
  }

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(
      `${org_id}/${document_id}/${document_version}.pdf`,
      60,
      {
        download: download_file_name ?? undefined,
      }
    );

  if (error || !data) {
    return { signedUrl: null, view: null };
  }

  const { signedUrl } = data;

  return { signedUrl, view: view_details };
};

export const authorizeViewer = async ({
  link_id,
  email,
  password,
}: {
  link_id: string;
  email?: string;
  password?: string;
}) => {
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
        ip: headers().get('x-real-ip'),
        geo: {
          city: headers().get('x-vercel-ip-city'),
          region: headers().get('x-vercel-ip-country-region'),
          country: headers().get('x-vercel-ip-country'),
        },
        ua: userAgent({ headers: headers() }),
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

      const domain = email.toLowerCase().split('@')[1];

      // Check if the email is disposable

      const res = await fetch(`https://open.kickbox.com/v1/disposable/${domain}`);

      if (!res.ok || (await res.json()).disposable) {
        throw new Error('Disposable emails are not allowed');
      }

      // Check if the email is authorized

      if (link.is_domain_restricted && link.restricted_domains) {

        const domains_list = link.restricted_domains.toLowerCase().split(',').map((part) => part.trim());

        if (
          !domains_list.some((part) => {
            if (part.includes('@')) {
              return part === email;
            }
            return domain.includes(part);
          })
        ) {
          throw new Error('The author has restricted access to this document. Please contact the author to get access');
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
      })
      .eq('view_id', insert_view.view_id);

    if (update_view_error) {
      throw new Error('Authorization failed. Please try again');
    }

    cookies().set(
      'hashdocs',
      JSON.stringify({
        [link_id]: {
          document_id: link.document_id,
          org_id: link.org_id,
          view_id: insert_view.view_id,
          viewer: email && email.length > 0 ? email : 'Anonymous',
          ip: headers().get('x-real-ip'),
        },
      }),
      {
        expires: new Date(new Date().getTime() + 1000 * 60 * 60),
      }
    );

    return { data: insert_view.view_id, error: null };
  } catch (error: any) {
    return { data: null, error: error?.message };
  }
};

export const updatePageTimes = async ({
  pageTimes,
  link_id,
}: {
  pageTimes: { pageNumber: number; entryTime: number; exitTime?: number }[];
  link_id: string;
}) => {
  const supabase = supabaseAdminClient();

  const cookie_val = cookies().get('hashdocs');

  if (!cookie_val || !cookie_val.value) {
    return;
  }

  const { document_id, org_id, view_id } =
    JSON.parse(cookie_val.value || '{}')?.[link_id] ?? {};

  const insert_rows: TablesInsert<'tbl_view_logs'>[] = pageTimes.map((item) => {
    return {
      page_num: item.pageNumber,
      start_time: item.entryTime,
      end_time: item.exitTime ?? item.entryTime + 1,
      document_id,
      link_id,
      org_id,
      view_id,
    };
  });

  await supabase.from('tbl_view_logs').upsert(insert_rows, {
    onConflict: 'view_id, page_num, start_time',
    ignoreDuplicates: false,
  });
};
