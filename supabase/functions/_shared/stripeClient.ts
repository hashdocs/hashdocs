import Stripe from "stripe";

export const stripeClient = new Stripe(Deno.env.get('STRIPE_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
});

// This is needed in order to use the Web Crypto API in Deno.
export const cryptoProvider = Stripe.createSubtleCryptoProvider();
