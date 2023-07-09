import Stripe from "https://esm.sh/stripe@12.12.0?target=deno&no-check";
// import StripeType from "https://esm.sh/v128/stripe@12.12.0/types/index.d.ts";

export const stripe = new Stripe(
    Deno.env.get("STRIPE_KEY")!,
    {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    }
  );
  
  // This is needed in order to use the Web Crypto API in Deno.
export const cryptoProvider = Stripe.createSubtleCryptoProvider();