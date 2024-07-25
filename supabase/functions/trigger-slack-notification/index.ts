import { PublicSchema, Tables } from '../../../types/supabase.types.ts';
import { InsertPayload } from '../_shared/supabaseClient.ts';

async function slack_notification(data: InsertPayload) {
  const { table, record } = data;

  let table_val = null;
  let record_val = null;

  switch (table) {
    case 'tbl_documents':
      table_val = 'Document';
      record_val = (record as Tables<'tbl_documents'>).document_name;
      break;

    case 'tbl_org':
      table_val = 'Org';
      record_val = (record as Tables<'tbl_org'>).org_name;
      break;

    case 'tbl_org_members':
      table_val = 'Org Member';
      record_val = (record as Tables<'tbl_org_members'>).email;
      break;

    case 'tbl_links':
      table_val = 'Link';
      record_val = (record as Tables<'tbl_links'>).link_name;
      break;

    case 'tbl_views':
      table_val = 'View';
      record_val = (record as Tables<'tbl_views'>).viewer;
      break;

    default:
      break;
  }

  const template = `{
    "attachments": [
      {
        "color": "#0010FF",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "New ${table_val} - *${record_val}*"
            }
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "plain_text",
                "text": "org_id: ${record.org_id}",
                "emoji": true
              },
            ]
          }
        ]
      }
    ]
  }`;

  if (table_val && record_val) {
    await fetch(Deno.env.get('SLACK_MONITOR')!, {
      method: 'POST',
      body: template,
    });
  }
}

Deno.serve(async (req) => {
  const data = await req.json();

  switch (data.table as keyof PublicSchema['Tables']) {
    case 'tbl_org':
    case 'tbl_documents':
    case 'tbl_org_members':
    case 'tbl_links':
    case 'tbl_views': {
      await slack_notification(data);

      break;
    }

    default:
      break;
  }

  return new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  });
});
