import { HashdocsLogo } from '@/app/_components/logo';
import clsx from 'clsx';
import { getOrg } from '../../_provider/org.actions';
import SidebarNav from './sidebarNav';
import { SidebarUserButton } from './sidebarUserButton';

export default async function MainSidebar() {

  const { org } = await getOrg();
  // const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={clsx(
        'z-50 hidden shrink-0 flex-col  justify-between gap-y-2 !overflow-x-hidden border-r border-gray-200 bg-white px-2 shadow-sm transition-all ease-in-out scrollbar-none lg:flex w-52',
        // isOpen ? 'w-52' : 'w-14'
      )}
      // onMouseEnter={() => setIsOpen(true)}
      // onMouseLeave={() => setIsOpen(false)}
    >
      <HashdocsLogo full className="my-1 ml-0.5" link />
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarNav />
      </div>
      <SidebarUserButton org={org} />
    </aside>
  );
}
