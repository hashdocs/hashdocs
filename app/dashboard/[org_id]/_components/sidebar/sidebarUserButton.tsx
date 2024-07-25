'use client';

import Button from '@/app/_components/button';
import OrgThumb from '@/app/_components/orgThumb';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiExpandVertical, BiUserPlus } from 'react-icons/bi';
import { FaCircleUser } from 'react-icons/fa6';
import { GrOrganization } from 'react-icons/gr';
import { IoMdHelpCircle } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';
import { MdAdd, MdCheck } from 'react-icons/md';
import useOrg from '../../_provider/useOrg';
import { useUser } from '../../_provider/useUser';

// Component for the top button and popover
export function SidebarUserButton() {
  const router = useRouter();
  const { user, handleLogout, handleRefreshSession } = useUser();
  const { org, orgData, handleCreateOrg } = useOrg();
  const [imageError, setImageError] = useState(false);

  const { org_id } = useParams() as { org_id: string };
  const path = usePathname();

  const org_popover_options = [
    {
      name: 'Settings',
      optionClick: () => {
        router.push(`/dashboard/${org_id}/settings/general`);
      },
      icon: <GrOrganization className="h-4 w-4" />,
    },
    {
      name: 'Invite team',
      optionClick: () => {
        router.push(`/dashboard/${org_id}/settings/team`);
      },
      icon: <BiUserPlus className="h-4 w-4" />,
    },
    {
      name: 'Help & Support',
      optionClick: () => {
        router.push(`mailto:bharat@hashdocs.org`);
      },
      icon: <IoMdHelpCircle className="h-4 w-4" />,
    },
    {
      name: 'Logout',
      optionClick: () => handleLogout(),
      icon: <IoLogOut className="h-4 w-4" />,
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
                  'group flex cursor-pointer items-center justify-start gap-x-2 rounded-md p-1 hover:bg-gray-200/50 focus:outline-none'
                )}
              >
                <>
                  <div className={clsx('flex items-center gap-x-2.5 p-0.5')}>
                    {(user && !imageError) ? (
                      <Image
                        className="h-7 w-7 shrink-0 rounded-full  "
                        src={user.user_metadata.avatar_url}
                        alt={user.id}
                        height={32}
                        width={32}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <FaCircleUser
                        className="h-7 w-7 rounded-full text-gray-600"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex flex-col pl-2">
                      <span className="w-28 truncate text-left font-semibold">
                        {user?.user_metadata.name || '-'}
                      </span>
                      <span className="w-28 truncate text-left text-xs text-gray-600">
                        {user?.email}
                      </span>
                    </div>
                    <BiExpandVertical className="-ml-1 h-4 w-4 text-gray-300" />
                  </div>
                </>
              </Popover.Button>
              <Popover.Panel
                className={clsx(
                  'absolute bottom-full z-[99] mb-2 flex w-48 transform'
                )}
              >
                {({ close }) => (
                  <div className="flex w-48 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
                    <Button
                      key={'new-org'}
                      onClick={() => handleCreateOrg()}
                      variant="outline"
                      className={clsx(
                        'flex w-full items-center justify-between gap-x-1 truncate border-0 !py-2.5 no-underline shadow-none'
                      )}
                    >
                      <div className="flex flex-1 items-center gap-x-2">
                        <MdAdd className={clsx('shrink-0')} />
                        <p className={clsx('text-gray-500')}>{`Create org`}</p>
                      </div>
                    </Button>
                    {orgData?.map((o) => (
                      <Button
                        key={o.org_id}
                        onClick={() => {
                          router.push(path.replace(org_id, o.org_id));
                        }}
                        variant="outline"
                        className={clsx(
                          'flex w-full items-center justify-between gap-x-1 truncate border-0 !py-2.5 no-underline shadow-none'
                        )}
                      >
                        <div className="flex flex-1 items-center gap-x-2">
                          <OrgThumb org={o} className="h-4 w-4" />
                          <p
                            className={clsx(
                              o.org_id == org_id
                                ? 'font-semibold '
                                : 'text-gray-500'
                            )}
                          >
                            {o.org_name}
                          </p>
                        </div>
                        <MdCheck
                          className={clsx(
                            o.org_id == org_id
                              ? 'font-semibold text-blue-700'
                              : 'opacity-0',
                            'shrink-0'
                          )}
                        />
                      </Button>
                    ))}
                    <hr />
                    <div className="relative flex flex-col">
                      {org_popover_options.map((item) => (
                        <Button
                          key={item.name}
                          onClick={item.optionClick}
                          variant="outline"
                          className={clsx(
                            'flex items-center gap-x-2 truncate border-0 !py-2 no-underline shadow-none'
                          )}
                        >
                          {item.icon}
                          {item.name}
                        </Button>
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
