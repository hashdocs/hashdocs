import Button from '@/app/_components/button';
import Dropdown from '@/app/_components/dropdown';
import MemberImage from '@/app/_components/memberImage';
import { Tables } from '@/types';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { CgRemove } from 'react-icons/cg';
import useOrg from '../../../_provider/useOrg';
import { useUser } from '../../../_provider/useUser';
import { changeRole, deleteMember } from '../_actions/team.actions';

export const MemberRow: React.FC<{ member: Tables<'tbl_org_members'> }> = ({
  member,
}) => {
  const { org } = useOrg();
  const router = useRouter();
  const { user } = useUser();

  return (
    <div
      key={member.email}
      className="grid grid-cols-12 border-b border-gray-100 py-2"
    >
      <div
        className={clsx(
          'col-span-6 flex items-center justify-start space-x-4',
          member.user_id ? '' : 'opacity-70'
        )}
      >
        <MemberImage member={member} />
        <div className="grid">
          <div className="text-sm font-medium capitalize ">
            {member.member_name ||
              member.email?.split('@')[0].split('.').join(' ')}
          </div>
          <div className="text-xs13 text-gray-400">{member.email}</div>
        </div>
      </div>
      <div className="col-span-5 flex items-center justify-start capitalize">
        <span
          className={clsx(
            'text-sm font-medium text-gray-600',
            member.user_id ? '' : 'opacity-70'
          )}
        >
          {member.user_id ? member.is_owner ? 'Owner' : member.role.toLowerCase() : 'Invited'}
        </span>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <Dropdown
          items={[
            {
              element: (
                <Button
                  variant="white"
                  size="sm"
                  className="w-full"
                  disabled={!!member.is_owner}
                  onClick={() => {
                    const changeRolePromise = new Promise<
                      Tables<'tbl_org_members'>
                    >(async (resolve, reject) => {
                      try {
                        const updated_member = await changeRole({
                          member,
                          new_role:
                            member.role === 'admin' ? 'member' : 'admin',
                        });

                        resolve(updated_member);
                      } catch (error) {
                        reject(error);
                      } finally {
                        router.refresh();
                      }
                    });

                    toast.promise(changeRolePromise, {
                      loading: `Updating role...`,
                      success: (member) =>
                        `Updated ${member.email} to ${member.role}`,
                      error: (e) =>
                        e?.message ??
                        `An error occured in updating the member. Please try again!`,
                    });
                  }}
                >
                  <div className="flex items-center justify-start gap-x-2 whitespace-nowrap">
                    <AiOutlineEdit className="text-sm" />
                    <span>
                      {member.role === 'admin' ? 'Make Member' : 'Make Admin'}
                    </span>
                  </div>
                </Button>
              ),
            },
            {
              element: (
                <Button
                  variant="white"
                  size="sm"
                  className="w-full"
                  disabled={!!member.is_owner}
                  onClick={() => {
                    const deleteMemberPromise = new Promise<string>(
                      async (resolve, reject) => {
                        try {
                          await deleteMember({ member });

                          resolve(member.email);
                        } catch (error) {
                          reject(error);
                        } finally {
                          router.refresh();
                        }
                      }
                    );

                    toast.promise(deleteMemberPromise, {
                      loading: `Removing member...`,
                      success: (email) => `Removed ${email} successfully`,
                      error: (e) =>
                        e?.message ??
                        `An error occured in removing member. Please try again!`,
                    });
                  }}
                >
                  <div className="flex items-center justify-start gap-x-2 whitespace-nowrap text-red-600">
                    <CgRemove className="text-sm" />
                    <span>Remove User</span>
                  </div>
                </Button>
              ),
            },
            //   ...(member.user_id
            //     ? []
            //     : [
            //         {
            //           element: (
            //             <Button
            //               variant="white"
            //               size="sm"
            //               className="w-full"
            //               buttonProps={{
            //                 onClick: () => {
            //                   if (member.email) {
            //                     toast.promise(
            //                       resendInvite(member.email),
            //                       {
            //                         loading: `Sending invite...`,
            //                         success: `Invite resent successfully`,
            //                         error: (e) =>
            //                           `Failed to send invite. Please try again!`,
            //                       }
            //                     );
            //                   }
            //                 },
            //               }}
            //             >
            //               <div className="flex items-center justify-start gap-x-2 whitespace-nowrap">
            //                 <CgMail className="text-sm" />
            //                 <span>Resend Invite</span>
            //               </div>
            //             </Button>
            //           ),
            //         },
            //       ]),
          ]}
        >
          {member.email !== user?.email && (
            <div className="rounded border-none bg-transparent p-1 hover:bg-gray-200">
              <BsThreeDots className="text-sm text-gray-600" />
            </div>
          )}
        </Dropdown>
      </div>
    </div>
  );
};
