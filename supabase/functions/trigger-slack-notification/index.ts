import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: null;
};

async function new_user_notification(payload: Record<string, unknown>) {
  const { email, raw_app_meta_data, id } = payload;

  const template = `{
    "attachments": [
      {
        "color": "#0010FF",
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
                "text": "user_id: ${id}",
                "emoji": true
              },
              {
                "type": "plain_text",
                "text": "provider: ${(raw_app_meta_data as any)["provider"]}",
                "emoji": true
              }
            ]
          }
        ]
      }
    ]
  }`;

  await fetch(Deno.env.get("SLACK_MONITOR")!, {
    method: "POST",
    body: template,
  });
}

serve(async (req) => {
  const data = (await req.json()) as InsertPayload;

  switch (data.table) {
    case "users":
      await new_user_notification(data.record);
      break;

    default:
      break;
  }

  return new Response(null, {
    headers: { "Content-Type": "application/json" },
  });
});
