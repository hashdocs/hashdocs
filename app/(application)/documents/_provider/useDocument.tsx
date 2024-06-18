'use client';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { DocumentType, Tables, TablesUpdate } from '@/types';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo } from 'react';
import toast from 'react-hot-toast';

interface DocumentContext {
  handleDocumentToggle: ({
    document,
    checked,
  }: {
    document: DocumentType;
    checked: boolean;
  }) => Promise<void>;
  handleDocumentDelete: ({ document }: { document: DocumentType }) => Promise<void>;
  handleLinkToggle: ({
    checked,
    link,
  }: {
    checked: boolean;
    link: Tables<'tbl_links'>;
  }) => Promise<void>;
  handleLinkDelete: ({ link }: { link: Tables<'tbl_links'> }) => Promise<void>;
  handleLinkUpdate: ({
    link,
    document,
  }: {
    link: TablesUpdate<'tbl_links'>;
    document: DocumentType;
  }) => Promise<void>;
}

export const DocumentContext = createContext<DocumentContext>(null!);

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  /* -------------------------------- DOCUMENT -------------------------------- */

  const handleDocumentToggle = useCallback(
    async ({
      document,
      checked,
    }: {
      document: DocumentType;
      checked: boolean;
    }) => {
      const togglePromise = new Promise(async (resolve, reject) => {
        try {
          const { error } = await supabase
            .from('tbl_documents')
            .update({ is_enabled: checked })
            .eq('document_id', document.document_id);

          if (error) {
            throw error;
          }

          resolve(true);
        } catch (error) {
          console.error(error);
          reject(false);
        }
      });

      await toast
        .promise(togglePromise, {
          loading: `Updating ${document.document_name}...`,
          success: !checked ? (
            <p>
              {document.document_name} is now{' '}
              {<span className="text-shade-gray-500">DISABLED</span>}
            </p>
          ) : (
            <p>
              {document.document_name} is now{' '}
              {<span className="text-stratos-default">ENABLED</span>}
            </p>
          ),
          error: `Error in updating ${document.document_name}. Please try again!`,
        })
        .finally(() => {
          router.refresh();
        });
    },
    []
  );

  // Delete document
  const handleDocumentDelete = useCallback(
    async ({ document }: { document: DocumentType }) => {
      const deletePromise = new Promise(async (resolve, reject) => {
        try {
          const { error } = await supabase
            .from('tbl_documents')
            .delete()
            .eq('document_id', document.document_id);

          if (error) {
            throw error;
          }

          resolve(true);
        } catch (error) {
          console.error(error);
          reject(false);
        }
      });

      await toast
        .promise(deletePromise, {
          loading: 'Deleting document...',
          success: 'Successfully deleted document',
          error: 'Error in deleting document. Please try again',
        })
        .finally(() => {
          router.refresh();
        });
    },
    []
  );

  /* ---------------------------------- LINK ---------------------------------- */

  // Handler for the toggle
  const handleLinkToggle = useCallback(
    async ({
      checked,
      link,
    }: {
      checked: boolean;
      link: Tables<'tbl_links'>;
    }) => {
      const togglePromise = new Promise(async (resolve, reject) => {
        try {
          const { error } = await supabase
            .from('tbl_links')
            .update({ is_active: checked })
            .eq('document_id', link.document_id)
            .eq('link_id', link.link_id);

          if (error) {
            throw error;
          }

          resolve(true);
        } catch (error) {
          console.error(error);
          reject(false);
        }
      });

      await toast
        .promise(togglePromise, {
          loading: `Updating link for ${link.link_name}...`,
          success: !checked ? (
            <p>
              Link for {link.link_name} is now{' '}
              {<span className="text-gray-500">INACTIVE</span>}
            </p>
          ) : (
            <p>
              Link for {link.link_name} is now{' '}
              {<span className="text-blue-700">ACTIVE</span>}
            </p>
          ),
          error: `Error in updating ${link.link_name}. Please try again!`,
        })
        .finally(() => {
          router.refresh();
        });
    },
    []
  );

  // Delete link
  const handleLinkDelete = useCallback(
    async ({ link }: { link: Tables<'tbl_links'> }) => {
      const deletePromise = new Promise(async (resolve, reject) => {
        try {
          const { error } = await supabase
            .from('tbl_links')
            .delete()
            .eq('document_id', link.document_id)
            .eq('link_id', link.link_id);

          if (error) {
            throw error;
          }

          resolve(true);
        } catch (error) {
          console.error(error);
          reject(false);
        }
      });

      await toast
        .promise(deletePromise, {
          loading: 'Deleting link...',
          success: 'Successfully deleted link',
          error: 'Error in deleting link. Please try again',
        })
        .finally(() => {
          router.refresh();
        });
    },
    []
  );

  // Update link
  const handleLinkUpdate = useCallback(
    async ({
      link,
      document,
    }: {
      link: TablesUpdate<'tbl_links'>;
      document: DocumentType;
    }) => {
      const deletePromise = new Promise(async (resolve, reject) => {
        try {
          if (!link.link_name) {
            throw new Error('Link name is required');
          }

          let base_req: any = supabase.from('tbl_links');

          if (link.link_id) {
            base_req = supabase.from('tbl_links').update(link).eq('link_id', link.link_id).eq('document_id', document.document_id).eq('org_id', document.org_id);
          } else {
            base_req = supabase
              .from('tbl_links')
              .insert({
                ...link,
                document_id: document.document_id,
                org_id: document.org_id,
                link_name: link.link_name,
              });
          }

          const { error: req_error } = await base_req.select('*');

          if (req_error) {
            throw req_error;
          }

          resolve(true);
        } catch (error) {
          console.error(error);
          reject(false);
        }
      });

      await toast
        .promise(deletePromise, {
          loading: link.link_id ? 'Updating link...' : 'Creating link...',
          success: link.link_id
            ? 'Successfully updated link...'
            : 'Successfully created link...',
          error: (e: any) =>
            e?.message ?? link.link_id
              ? 'Error in updating the link. Please try again'
              : 'Error in creating the link. Please try again',
        })
        .finally(() => {
          router.refresh();
        });
    },
    []
  );

  const value = useMemo(
    () => ({
      handleDocumentToggle,
      handleDocumentDelete,
      handleLinkToggle,
      handleLinkDelete,
      handleLinkUpdate,
    }),
    [
      handleDocumentDelete,
      handleDocumentToggle,
      handleLinkToggle,
      handleLinkUpdate,
    ]
  );

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default function useDocument() {
  const document = useContext(DocumentContext);

  return document;
}
