import { IconType } from 'react-icons';
import { AiFillSignature } from 'react-icons/ai';
import { HiDocumentChartBar } from 'react-icons/hi2';
import { IoMdSettings } from 'react-icons/io';
import { RiContactsBookFill, RiFolderLockFill } from 'react-icons/ri';

export type primaryNavigationType = {
  name: string;
  path: string;
  description: string;
  icon: IconType;
};

export const primaryNavigation: primaryNavigationType[] = [
  {
    name: 'Documents',
    path: '/documents',
    description: 'Upload documents and create shareable links',
    icon: HiDocumentChartBar,
  },
  {
    name: 'Data Room',
    path: '/dataroom',
    description: 'Manage your virtual data rooms',
    icon: RiFolderLockFill,
  },
  {
    name: 'Signatures',
    path: '/signatures',
    icon: AiFillSignature,
    description: 'Collect and manage e-signatures',
  },
  {
    name: 'Contacts',
    path: '/contacts',
    icon: RiContactsBookFill,
    description: 'Manage contacts and viewers',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: IoMdSettings,
    description: 'Edit your preferences and settings',
  },
];
