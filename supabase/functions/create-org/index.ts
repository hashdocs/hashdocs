import { OrgType } from '../../../types/index.ts';
import { Tables } from '../../../types/supabase.types.ts';
import { resend_email } from '../_emails/resend.ts';
import { welcome } from '../_emails/templates/welcome.ts';
import { stripeClient } from '../_shared/stripeClient.ts';
import { InsertPayload, supabaseAdmin } from '../_shared/supabaseClient.ts';

async function new_org_notification(payload: Record<string, any>) {
  const { email, org_id, stripe_customer_id } = payload;

  const template = `{
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "👤New user - *${email}*"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "org_id: ${org_id}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "stripe_id: ${stripe_customer_id}",
            "emoji": true
          },
        ]
      },
    ]
  }`;

  await fetch(Deno.env.get('SLACK_MONITOR')!, {
    method: 'POST',
    body: template,
  });
}

Deno.serve(async (req) => {
  try {
    const body = (await req.json()) as InsertPayload;

    const { org_id } = body.record as Tables<'tbl_org'>;

    console.log(`Initiating org processing for - ${org_id}`);

    const { data: org_info, error: org_error } = await supabaseAdmin
      .rpc('get_org', { org_id_input: org_id })
      .returns<OrgType[]>();

    if (org_error || !org_info || !org_info?.at(0)) {
      throw org_error || new Error(`Error fetching org`);
    }

    const new_org = org_info[0];
    const owner = new_org.find(
      (user: Tables<'tbl_org_members'>) => user.is_owner
    );

    console.log(`${org_id} - Fetched email from org - ${owner.email}`);

    /* ------------------------ Create customer in stripe ----------------------- */

    const customer = await stripeClient.customers.create({
      email: owner?.email,
      metadata: { org_id: new_org.org_id },
    });

    console.log(`${org_id} - Created customer - ${customer.id}`);

    /* ------------------------ Update org in supabase -------------------------- */

    const { data: customer_update, error: customer_update_error } =
      await supabaseAdmin
        .from('tbl_org')
        .update({
          stripe_customer_id: customer.id,
        })
        .eq('org_id', org_id)
        .select()
        .maybeSingle();

    if (customer_update_error || !customer_update) {
      throw Error(
        `Error updating org - ${JSON.stringify(customer_update_error)}`
      );
    }

    /* ------------------------ Send slack notification ------------------------- */
    await new_org_notification({
      email: owner?.email,
      org_id: customer.metadata.org_id,
      stripe_customer_id: customer.id,
      user_id: owner?.user_id,
    });

    console.log(`${org_id} - Completed successfully`);

    /* ------------------------ Send welcome email ------------------------- */

    const email_res = await resend_email({
      to: [owner?.email ?? ''],
      subject: 'Welcome to Hashdocs',
      html: welcome,
    });

    console.log(
      `${org_id} - Sent welcome email - ${JSON.stringify(email_res)}`
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  });
});
