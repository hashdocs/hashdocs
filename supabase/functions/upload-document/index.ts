import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
serve(async (_req) => {
  // const storeAsImage = fromBase64(base64txt);
  // const pageToConvertAsImage = 1;

  // const res = await storeAsImage(1);

  return new Response(JSON.stringify('h'), {
    headers: { "Content-Type": "application/json" },
  });
});
