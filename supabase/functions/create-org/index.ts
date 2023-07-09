import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripeClient.ts";
import {
  InsertPayload,
  OrgType,
  supabaseAdmin,
} from "../_shared/supabaseClient.ts";

async function new_org_notification(payload: Record<string, any>) {
  const { email, org_id, stripe_customer_id, user_id } = payload;

  const template = `{
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "👤New org signup - *${email}*"
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
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "env: ${Deno.env.get("ENV")}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "user_id: ${user_id}",
            "emoji": true
          },
        ]
      },
    ]
  }`;

  await fetch(Deno.env.get("SLACK_MONITOR")!, {
    method: "POST",
    body: template,
  });
}

serve(async (req) => {
  try {
    const body = (await req.json()) as InsertPayload;

    const { id } = body.record;

    /* ------------------------- Fetch org_info from body ------------------------- */

    const { data: insert_org, error: insert_error } = await supabaseAdmin
      .from("tbl_org")
      .insert({
        org_name: "My Org",
      })
      .select("*")
      .maybeSingle();

    if (insert_error || !insert_org) {
      throw Error(`Error inserting org - ${insert_error}`);
    }

    const org_id = insert_org.org_id;

    const { data: _insert_member, error: insert_member_error } =
      await supabaseAdmin.from("tbl_org_members").insert({
        org_id: org_id,
        user_id: id,
        user_role: "OWNER",
      });

    if (insert_member_error) {
      throw Error(`Error inserting member - ${insert_member_error}`);
    }

    console.log(`${org_id} - Initiating stripe customer creation`);

    const { data: org_info, error: org_error } = await supabaseAdmin
      .rpc("get_org", { org_id_input: org_id })
      .returns<OrgType>();

    console.log(`${org_id} - Fetched ${org_info}`);

    if (org_error || !org_info) {
      throw Error(`Error fetching org - ${org_error}`);
    }

    const owner = org_info.users.find((user) => user.user_role === "OWNER");

    /* ------------------------ Create customer in stripe ----------------------- */

    //@ts-expect-error: <Stripe Deno error>
    const customer = await stripe.customers.create({
      email: owner?.email,
      metadata: { org_id: org_info.org_id },
    });

    console.log(`${org_id} - Created customer - ${customer.id}`);

    /* ------------------------ Update org in supabase -------------------------- */

    const { data: customer_update, error: customer_update_error } =
      await supabaseAdmin
        .from("tbl_org")
        .upsert(
          {
            stripe_customer_id: customer.id,
            org_id: org_id,
          },
          {
            onConflict: "org_id",
            ignoreDuplicates: false,
          }
        )
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
    
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, {
    headers: { "Content-Type": "application/json" },
  });
});
