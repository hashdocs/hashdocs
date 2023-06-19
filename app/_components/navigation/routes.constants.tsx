import {
  CalendarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  UsersIcon,
  Cog8ToothIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export const primaryNavigation = [
  {
    name: "Documents",
    path: "/documents",
    description: "Upload documents and create shareable links",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Data Room",
    path: "/dataroom",
    description: "Manage your virtual data rooms",
    icon: FolderIcon,
  },
  {
    name: "Signatures",
    path: "/signatures",
    icon: PencilSquareIcon,
    description: "Collect and manage e-signatures",
  },
  {
    name: "Users",
    path: "/users",
    icon: UsersIcon,
    description: "View users and shared history",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Cog8ToothIcon,
    description: "Manage your account settings",
  },
];
