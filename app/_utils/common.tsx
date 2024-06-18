import { DocumentType } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Copy link to clipboard
export const CopyLinkToClipboard = async (
  copyText: string,
  isToast: boolean = true,
  toastId?: string
) => {
  const copyPromise = navigator.clipboard.writeText(`${copyText}`);

  isToast &&
    toast.promise(
      copyPromise,
      {
        loading: 'Copying...',
        success: (
          <p className="font-normal">
            Successfully copied{' '}
            <Link
              href={copyText}
              target="_blank"
              className="text-stratos-default font-semibold underline"
            >
              {copyText}
            </Link>{' '}
            to clipboard
          </p>
        ),
        error: `An error occured while copying! Please copy manually`,
      },
      {
        id: toastId,
      }
    );
};

export const generateRandomString = (length: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getDocumentPath = ({ document }: { document: DocumentType }) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document.org_id}/${document.document_id}/${document.document_version}.pdf?token=${document.token}`;

export const getThumbnailPath = ({path}:{path:string}) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${path}`;

export const base64ToArrayBuffer = (base64:string) => {
  // Remove the data URL prefix if it exists
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = Buffer.from(base64Data, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
