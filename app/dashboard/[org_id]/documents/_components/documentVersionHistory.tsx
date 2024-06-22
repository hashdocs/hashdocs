import Modal, { ModalRef } from '@/app/_components/modal';
import { DocumentDetailType } from '@/types';
import clsx from 'clsx';
import useDocument from '../_provider/useDocument';
import {
    DocumentSourceText,
    DocumentThumbnail,
    DocumentVersionText,
} from './documentButtons';

interface DocumentVersionHistoryModalProps {
  modalRef: React.RefObject<ModalRef>;
  document: DocumentDetailType;
}

export const DocumentVersionHistoryModal: React.FC<
  DocumentVersionHistoryModalProps
> = ({ modalRef, document }) => {
  /*-------------------------------- RENDER ------------------------------*/

  const { handleDocumentVersionSwitch } = useDocument();

  return (
    <Modal ref={modalRef} title={`Version History`}>
      <div className="hashdocs-scrollbar flex !max-h-[480px] flex-col gap-y-4">
        {(document.versions || []).map((version) => (
          <div
            className={clsx('flex items-center gap-x-4')}
            key={version.document_version}
          >
            <DocumentThumbnail
              document_id={document.document_id}
              link={`/preview/${document.document_id}/${version.document_version}`}
              image={version.thumbnail_image}
            />
            <div className="flex flex-col gap-y-1">
              <DocumentVersionText
                document_version={version.document_version}
                updated_at={version.updated_at}
              />
              <DocumentSourceText
                source_path={version.source_path}
                source_type={version.source_type}
              />
              <div
                className={clsx(
                  'flex w-20 items-start cursor-pointer gap-x-2 rounded py-1'
                  //   version.is_active
                  //     ? 'bg-blue-700 text-white'
                  //     : 'bg-gray-200'
                )}
                
              >
                <input
                  type="checkbox"
                  id={`checkbox_${version.document_version}`}
                  checked={version.is_active}
                  onClick={() =>
                    handleDocumentVersionSwitch({
                      document,
                      new_version: version.document_version,
                    })
                  }
                  className="!h-3.5 !w-3.5 !rounded-sm !cursor-pointer !outline-none checked:!bg-blue-700  "
                ></input>
                <label
                  className={clsx(
                    'text-xs cursor-pointer',
                    version.is_active ? 'font-semibold text-blue-700' : ''
                  )}
                  htmlFor={`checkbox_${version.document_version}`}
                >
                  {version.is_active ? 'Active' : 'Inactive'}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
