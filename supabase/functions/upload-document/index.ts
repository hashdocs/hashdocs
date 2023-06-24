import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { errorHandler } from "../_shared/errorHandler.ts";
import { DocumentType, supabaseAdmin } from "../_shared/supabaseClient.ts";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

serve(async (req) => {
  const { document_id } = await req.json();

  const { data: document_data, error: document_error } = await supabaseAdmin
    .rpc("get_document_id", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_error || !document_data || !document_data[0]) {
    return errorHandler(document_error);
  }

  const doc = document_data[0];

  console.info(
    `Creating URL for ${doc.document_id}/${doc.document_version}.pdf`
  );

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(`${doc.document_id}/${doc.document_version}.pdf`, 60);

  if (error || !data || !data.signedUrl) {
    return errorHandler(error);
  }

  console.info(`Created a signed url - ${data.signedUrl}`)

  const arrayBuffer = await fetch(data.signedUrl).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const numPages = pdfDoc.getPages().length;

  const res = await fetch(
    `https://v2.convertapi.com/convert/pdf/to/jpg?Secret=eXGjMP9OLZfun7mv`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Url: data.signedUrl,
            },
          },
          {
            Name: "PageRange",
            Value: "1",
          },
          {
            Name: "PreserveResolution",
            Value: true,
          },
        ],
      }),
    }
  );

  const return_body = await res.json();

  if (!return_body.Files || !return_body.Files[0])
    return errorHandler("No file returned");

  const thumbnail_file = return_body.Files[0];
  const thumbnail_arrayBuffer = base64ToArrayBuffer(thumbnail_file.FileData);

  const { data: upload_data, error: upload_error } = await supabaseAdmin.storage
    .from("thumbnails")
    .upload(`${doc.document_id}.jpg`, thumbnail_arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (upload_error || !upload_data) {
    return errorHandler(upload_error);
  }

  const { error: update_error } = await supabaseAdmin
    .from("tbl_documents")
    .update({ image: upload_data.path })
    .eq("document_id", doc.document_id);

  const { error: page_update_error } = await supabaseAdmin
    .from("tbl_document_versions")
    .update({ page_count: numPages })
    .eq("document_id", doc.document_id).eq("document_version", doc.document_version);

  if (update_error || page_update_error) {
    return errorHandler({ update_error, page_update_error });
  }

  return new Response(JSON.stringify(upload_data), {
    headers: { "Content-Type": "application/json" },
  });
});

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
