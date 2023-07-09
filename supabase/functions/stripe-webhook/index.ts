import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cryptoProvider, stripe } from "../_shared/stripeClient.ts";
// import StripeType from "https://esm.sh/v128/stripe@12.12.0/types/index.d.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature");

  const body = await request.text();

  //@ts-expect-error: <Stripe Deno error>
  const receivedEvent = await stripe.webhooks.constructEventAsync(
    body,
    signature!,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    undefined,
    cryptoProvider
  );

  console.log(`${receivedEvent.id} - Received event: ${receivedEvent.type}`);

  if (receivedEvent.type.includes("customer.subscription")) {
    const subscription_data = receivedEvent.data
      .object 
      // as StripeType.Subscription;

    const {
      customer,
      status,
      current_period_start,
      current_period_end,
      items,
    } = subscription_data;

    const { data: subscription_update, error: subscription_update_error } =
      await supabaseAdmin
        .from("tbl_org")
        .upsert(
          {
            stripe_customer_id: customer.toString(),
            subscription_status: status,
            billing_cycle_start: new Date(
              current_period_start * 1000
            ).toISOString(),
            billing_cycle_end: new Date(
              current_period_end * 1000
            ).toISOString(),
            stripe_price_plan: items.data[0].price.id,
          },
          { onConflict: "stripe_customer_id" }
        )
        .select("*")
        .maybeSingle();

    if (subscription_update_error) {
      console.error(subscription_update_error);
      return new Response(JSON.stringify(subscription_update_error), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(
      `${receivedEvent.id} - Updated payment for: ${subscription_update?.org_id}`
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
