import { Database } from "@/types/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2022-11-15",
});

/*================================ AUTHORIZE VIEWER ==============================*/

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
    error: user_error,
  } = await supabase.auth.getUser();

  if (user_error || !user) {
    console.error(user_error);
    return NextResponse.json(user_error, { status: 500 });
  }

  try {
    const data = (await request.json()) as {
      lookup_key: string;
      stripe_customer_id: string;
      org_id: string;
      quantity?: number;
    };

    const prices = await stripe.prices.list({
      lookup_keys: [data.lookup_key],
      expand: ["data.product"],
    });

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      customer: data.stripe_customer_id,
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: data.quantity || 1,
        },
      ],
      client_reference_id: data.org_id,
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}


/*================================ MANAGE SUBSCRIPTION ==============================*/

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
    error: user_error,
  } = await supabase.auth.getUser();

  if (user_error || !user) {
    console.error(user_error);
    return NextResponse.json(user_error, { status: 500 });
  }

  try {
    const data = (await request.json()) as {
      lookup_key: string;
      stripe_customer_id: string;
      org_id: string;
      quantity?: number;
    };

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}
