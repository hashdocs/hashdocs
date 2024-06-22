'use server';
import { supabaseAdminClient } from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2024-04-10',
});

/*================================ AUTHORIZE VIEWER ==============================*/

export async function stripeAction({
  org,
  quantity,
  checkout,
  product = 'pro_monthly',
}: {
  org: OrgType;
  quantity?: number;
  checkout?: boolean;
  product?: string;
}) {
  let stripe_url: string | null = null;
  const supabase = supabaseAdminClient();

  try {
    let { stripe_customer_id, org_id, members } = org;

    const owner = members.find((member) => member.is_owner);

    if (!owner) {
      throw new Error('No owner found');
    }

    if (!stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: owner.email,
        metadata: { org_id: org_id },
      });

      const { data: customer_update, error: customer_update_error } =
        await supabase
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

      stripe_customer_id = customer.id;
    }

    const prices = await stripe.prices.list({
      lookup_keys: [product],
      expand: ['data.product'],
    });

    if (!checkout) {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing`,
      });

      stripe_url = session.url;
    } else {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer: stripe_customer_id,
        line_items: [
          {
            price: prices.data[0].id,
            // For metered billing, do not pass quantity
            quantity: quantity || 1,
          },
        ],
        client_reference_id: org_id,
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing?canceled=true`,
      });

      stripe_url = session.url;
    }

    return { url: stripe_url };
  } catch (e) {
    console.error(e);
    return { url: null };
  }
}
