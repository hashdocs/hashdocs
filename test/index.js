const { createClient } = require('@supabase/supabase-js');

const supabaseAdminClient = () =>
  createClient(
    'https://dblpeefwccpldqwuzwza.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibHBlZWZ3Y2NwbGRxd3V6d3phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NjY4MDY2MSwiZXhwIjoyMDAyMjU2NjYxfQ.b-ufcg6qF9lw-n8xj4TDJQJxSRZcSGOhnWHIJndZFSo',
    {
      auth: {
        persistSession: false,
      },
    }
  );

async function main() {
  const supabase = supabaseAdminClient();

  const { data, error } = await supabase.storage.from('documents').list();

  const document_id_array = data
    .filter((doc) => doc.name !== 'TEMP')
    .map((doc) => doc.name);

  console.log(document_id_array);

  const { data: tbl_documents, error: tbl_documents_error } = await supabase
    .from('view_documents')
    .select('*')
    .in('document_id', document_id_array);

  //   console.log(tbl_documents.map((doc) => ({document_id:doc.document_id, org_id:doc.org_id, document_version:doc.document_version})));

  for (const new_document_data of tbl_documents.map((doc) => ({
    document_id: doc.document_id,
    org_id: doc.org_id,
    document_version: doc.document_version,
  }))) {
    const { data: _document_upload_path, error: document_upload_error } =
      await supabase.storage
        .from('documents')
        .move(
          `${new_document_data.document_id}/${new_document_data.document_version}.pdf`,
          `${new_document_data.org_id}/${new_document_data.document_id}/${new_document_data.document_version}.pdf`
        );

    console.log(_document_upload_path.message, document_upload_error);
  }
}

main();
