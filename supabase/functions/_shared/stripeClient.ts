import Stripe from "https://esm.sh/stripe@12.12.0?target=deno";
// import StripeType from "https://esm.sh/v128/stripe@12.12.0/types/index.d.ts";

export const stripe = new Stripe(
    "sk_test_51NR4AQHUVtdp8pCHP9a1d4KLKL5UqY30ygCgZa4RfkfGJT9rnbAedgkD8gDoc50jXjKa33ngU3yNn5mippM2G7Hq00HsPfpT3t",
    {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    }
  );
  
  // This is needed in order to use the Web Crypto API in Deno.
export const cryptoProvider = Stripe.createSubtleCryptoProvider();