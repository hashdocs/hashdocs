'use client';
import Button from '@/app/_components/button';
import { ModalRef } from '@/app/_components/modal';
import Switch from '@/app/_components/switch';
import { CopyLinkToClipboard } from '@/app/_utils/common';
import { formatDate } from '@/app/_utils/dateFormat';
import { DocumentDetailType } from '@/types';
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiCopy, BiLinkExternal } from 'react-icons/bi';
import { IoEye, IoOptions } from 'react-icons/io5';
import LinkModal from '../../../_components/linkModal';
import useDocument from '../../../_provider/useDocument';

type LinkDocumentProps = {
  link_id: string;
  document: DocumentDetailType;
};

/*=========================================== COMPONENT ===========================================*/

const LinkRow: React.FC<LinkDocumentProps> = ({ link_id, document }) => {
  const link = document.links.find((link) => link.link_id === link_id);

  if (!link) return null;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(link.is_active);
  const modalRef = useRef<ModalRef>(null);

  const views = document.views.filter((view) => view.link_id === link_id);
  const router = useRouter();

  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/d/${link_id}`;

  const {handleLinkToggle} = useDocument();

  /*================================ RENDER ==============================*/

  return (
    <li
      key={link_id}
      className={`my-2 rounded-md bg-white p-4 shadow-sm  ${
        isActive && document?.is_enabled ? '' : 'text-gray-500'
      }`}
    >
      <div className={` flex items-center justify-between gap-x-4`}>
        {/*-------------------------------- LEFT ------------------------------*/}

        <div className=" flex w-1/4 shrink-0 flex-row items-center gap-x-4">
          <div className="flex flex-col ">
            <p className={`font-semibold`}>{link.link_name}</p>
            <p className="text-shade-gray-500 text-xs">
              {link.created_at && formatDate(link.created_at, 'MMM D', false)}
            </p>
          </div>
        </div>

        {/*-------------------------------- MIDDLE ------------------------------*/}

        <div className="flex w-1/3 shrink-0 flex-row items-center space-x-2 text-xs">
          <div
            onClick={() => CopyLinkToClipboard(path, true, `${link_id}-url`)}
            className={`flex items-center space-x-2 rounded-xl bg-gray-50 px-4 py-2 ${
              isActive && document?.is_enabled
                ? 'cursor-pointer text-blue-700 '
                : 'pointer-events-none text-gray-500'
            } shadow-inner`}
          >
            <span className="px-1 font-mono">
              {path.replace(/^https?:\/\//, '')}
            </span>
            <BiCopy className="h-4 w-4 " />
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/d/${link_id}`}
              target="_blank"
              rel="noreferrer"
              className="px-1"
            >
              <BiLinkExternal className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Link href={`/documents/${document?.document_id}/views?id=${link_id}`}>
          <Button
            className="flex items-center gap-x-1"
            size="sm"
            variant="outline"
          >
            <IoEye className="h-4 w-4" />
            <span>{views.length} views</span>
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Switch
            enabled={isActive}
            setEnabled={setIsActive}
            callback={(checked) => handleLinkToggle({ checked, link })}
            disabled={!document?.is_enabled}
          />
          <Button size='sm' variant='icon' >
            <IoOptions className='h-5 w-5' onClick={() => modalRef.current?.openModal()} />
          </Button>
          <div
            className="pointer-events-auto cursor-pointer rounded-md p-2 hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>
      <motion.div
        initial={isOpen}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <AnimatePresence initial={false}>
          {isOpen && views && views.length > 0 && (
            <div className="accordion-content mt-6 flex w-full flex-col">
              {/* {ViewsHeader()} */}
              {views &&
                views.map((view, idx) =>
                  idx < 5 ? (
                    // ViewRow({link_name, ...view},idx)
                    <></>
                  ) : null
                )}
              <div className=" text-shade-gray-500 hover:text-stratos-default grid grid-cols-12 justify-end pt-2 text-xs shadow-sm hover:underline">
                <Link
                  href={{
                    pathname: `/documents/${document?.document_id}/views`,
                    search: `id=${link_id}`,
                  }}
                  className="col-span-12 flex justify-end"
                >
                  {`see all ${views.length} views`}
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      <LinkModal modalRef={modalRef} document={document} link={link} />
    </li>
  );
};

export default LinkRow;

/*=========================================== OTHER FUNCTIONS ===========================================*/
