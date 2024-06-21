'use client';

import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BiExpandVertical } from 'react-icons/bi';
import { FaCircleUser } from 'react-icons/fa6';
import useOrg from '../../_provider/useOrg';

// Component for the top button and popover
export function SidebarUserButton() {
  const router = useRouter();
  const { org, user, handleLogout } = useOrg();

  const org_popover_options = [
    {
      name: 'Organization settings',
      optionClick: () => {
        router.push('/settings/general');
      },
      admin_only: true,
    },
    {
      name: 'Invite team',
      optionClick: () => {
        router.push('/settings/team');
      },
      admin_only: true,
    },
    {
      name: 'Help & Support',
      optionClick: () => {
        router.push(
          `mailto:bharat@hashdocs.org?subject=Need%20help%20%7C%20org_id%3A%20${org.org_id}`
        );
      },
      admin_only: false,
    },
    {
      name: 'Logout',
      optionClick: () => handleLogout(),
    },
  ];

  return (
    <>
      <div className="flex h-14 items-center justify-between">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={clsx(
                  'group flex cursor-pointer items-center justify-start gap-x-2 rounded-md p-1 hover:bg-gray-200/50 focus:outline-none',
                )}
              >
                <>
                  <div className={clsx('flex items-center gap-x-2.5 p-0.5')}>
                    {user ? (
                      <Image
                        className="h-7 w-7 shrink-0 rounded-full  "
                        src={user.user_metadata.avatar_url}
                        alt={user.id}
                        height={32}
                        width={32}
                      />
                    ) : (
                      <FaCircleUser
                        className="h-7 w-7 rounded-full text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex flex-col pl-2">
                      <span className="w-28 truncate text-left font-semibold">
                        {org.org_name}
                      </span>
                      <span className="w-28 truncate text-left text-xs text-gray-600">
                        {user.email}
                      </span>
                    </div>
                    <BiExpandVertical className="-ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </>
              </Popover.Button>
              <Popover.Panel
                className={clsx(
                  'absolute bottom-full mb-2 z-[99] flex w-48 transform'
                )}
              >
                {({ close }) => (
                  <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
                    <div className="relative flex flex-col">
                      {org_popover_options.map((item) => (
                        <button
                          key={item.name}
                          onClick={item.optionClick}
                          className={clsx(
                            'focus:ring-none flex items-center p-2 transition duration-150 ease-in-out hover:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit max-lg:hidden'
                          )}
                        >
                          <p className="px-2">{item.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </>
  );
}
