import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Database } from "../../../types/supabase.types.ts";
import { InsertPayload } from "../_shared/supabaseClient.ts";

async function new_user_notification(payload: Record<string, unknown>) {
  const { email, raw_app_meta_data, id } = payload;

  const template = `{
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
      },
    ]
  }`;

  await fetch(Deno.env.get("SLACK_MONITOR")!, {
    method: "POST",
    body: template,
  });
}

async function new_document_notification(
  payload: Database["public"]["Tables"]["tbl_documents"]["Row"]
) {
  const { document_name, document_seq, document_id } = payload;

  const template = `{
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "📄New document - *${document_name}*"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "#: ${document_seq}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "document_id: ${document_id}",
            "emoji": true
          }
        ]
      },
    ]
  }`;

  await fetch(Deno.env.get("SLACK_MONITOR")!, {
    method: "POST",
    body: template,
  });
}

async function new_link_notification(
  payload: Database["public"]["Tables"]["tbl_links"]["Row"]
) {
  const { link_id, link_name, document_id, link_seq } = payload;

  const template = `{
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "📄New link - *${link_name}*"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "#: ${link_seq}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "link_id: ${link_id}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "document_id: ${document_id}",
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

async function new_view_notification(
  payload: Database["public"]["Tables"]["tbl_views"]["Row"]
) {
  const { link_id, view_id, viewer, view_seq } = payload;

  const template = `{
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "📄New view - *${viewer}*"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "#: ${view_seq}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "link_id: ${link_id}",
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": "view_id: ${view_id}",
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
  const data = (await req.json()) as InsertPayload;

  switch (data.table) {
    case "users":
      await new_user_notification(data.record);
      break;

    case "tbl_documents":
      await new_document_notification(
        data.record as Database["public"]["Tables"]["tbl_documents"]["Row"]
      );
      break;

    case "tbl_links":
      await new_link_notification(
        data.record as Database["public"]["Tables"]["tbl_links"]["Row"]
      );
      break;

    case "tbl_views":
      await new_view_notification(
        data.record as Database["public"]["Tables"]["tbl_views"]["Row"]
      );
      break;

    default:
      break;
  }

  return new Response(null, {
    headers: { "Content-Type": "application/json" },
  });
});
