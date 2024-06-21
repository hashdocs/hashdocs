import Stripe from 'stripe';
import { cryptoProvider, stripeClient } from '../_shared/stripeClient.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

Deno.serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature');

  const body = await request.text();

  const receivedEvent = await stripeClient.webhooks.constructEventAsync(
    body,
    signature!,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    undefined,
    cryptoProvider
  );

  console.log(`${receivedEvent.id} - Received event: ${receivedEvent.type}`);

  if (receivedEvent.type.includes('customer.subscription')) {
    const subscription_data = receivedEvent.data.object;
    // as StripeType.Subscription;

    const {
      customer,
      status,
      current_period_start,
      current_period_end,
      items,
    } = subscription_data as Stripe.Subscription;

    const product = await stripeClient.products.retrieve(
      items.data[0].price.product as string
    );

    const { data: subscription_update, error: subscription_update_error } =
      await supabaseAdmin
        .from('tbl_org')
        .update({
          stripe_metadata: {
            billing_cycle_start: new Date(
              current_period_start * 1000
            ).toISOString(),
            billing_cycle_end: new Date(
              current_period_end * 1000
            ).toISOString(),
            stripe_price_plan: items.data[0].price.id,
            stripe_product_plan: product.name,
            stripe_subscription_status: status,
          },
          org_plan: status === 'active' ? product.name : 'Free',
        })
        .eq('stripe_customer_id', customer)
        .select('*')
        .maybeSingle();

    if (subscription_update_error) {
      console.error(subscription_update_error);
      return new Response(JSON.stringify(subscription_update_error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(
      `${receivedEvent.id} - Updated subscription for: ${subscription_update?.org_id}`
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
