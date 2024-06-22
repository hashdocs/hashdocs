'use client';

import Button from '@/app/_components/button';
import Input from '@/app/_components/input';
import Modal, { ModalRef } from '@/app/_components/modal';
import { Tables } from '@/types';
import { Listbox, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BiUserPlus } from 'react-icons/bi';
import useOrg from '../../../_provider/useOrg';
import { inviteTeam } from '../_actions/team.actions';

const InviteUserFormModal: React.FC<{
  modalRef: React.RefObject<ModalRef>;
}> = ({ modalRef }) => {
  const router = useRouter();
  const { org } = useOrg();

  const [newUser, setNewUser] = useState<{
    email: string;
    role: 'member' | 'admin';
  }>({
    email: '',
    role: 'admin',
  });

  const validateUser = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return {
      message: !['member', 'admin'].includes(newUser.role)
        ? 'Invalid invited team member role'
        : !emailRegex.test(newUser.email)
        ? 'Invalid email address entered. Please check and try again'
        : null,
      isValid:
        ['member', 'admin'].includes(newUser.role) &&
        emailRegex.test(newUser.email),
    };
  };

  const onSubmit = async () => {
    const { isValid, message } = validateUser();
    if (!isValid) {
      toast.error(message);
      return;
    }

    const inviteUsersPromise = new Promise<Tables<'tbl_org_members'>>(
      async (resolve, reject) => {
        try {
          const new_member = await inviteTeam({
            email: newUser.email.toLowerCase(),
            role: newUser.role,
            org_id: org.org_id,
          });

          if (!new_member) {
            throw new Error('Error while inviting user');
          }

          resolve(new_member);
          modalRef.current?.closeModal();
        } catch (error) {
          reject(error);
        } finally {
          router;
        }
      }
    );

    toast.promise(inviteUsersPromise, {
      loading: 'Inviting user...',
      error: (err) => err || 'Error while inviting',
      success: (new_member) => `Invited ${new_member.email} successfully`,
    });
  };

  return (
    <Modal ref={modalRef} title={'Invite team'}>
      <div className="grid space-y-5">
        <label className="grid space-y-3">
          <span className="text-xs13 font-medium text-gray-600">Email</span>
          <Input
            size="lg"
            inputProps={{
              placeholder: 'michael@dundermifflin.com',
              onChange: (e) => {
                setNewUser((prv) => ({
                  ...prv,
                  email: e.target.value,
                }));
              },
              value: newUser.email,
            }}
          />
        </label>
        <div className="grid space-y-3">
          <span className="text-xs13 font-medium text-gray-600">Invite as</span>
          <label className="relative">
            <Listbox
              value={newUser.role}
              onChange={(e) => setNewUser((prv) => ({ ...prv, role: e }))}
            >
                  <Listbox.Button
                    className={`w-full rounded-md border px-4 py-3 text-start capitalize`}
                  >
                    {newUser.role}
                  </Listbox.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options
                      className={`absolute w-full rounded-md border text-xs shadow-lg`}
                    >
                      {[
                        {
                          label: (
                            <p>
                              Admin -{' '}
                              <span className="text-gray-400">
                                Full access with no limitations
                              </span>
                            </p>
                          ),
                          value: 'admin',
                        },
                        {
                          label: (
                            <p>
                              Member -{' '}
                              <span className="text-gray-400">
                                Access with limited permissions
                              </span>
                            </p>
                          ),
                          value: 'member',
                        },
                      ].map((role) => (
                        <Listbox.Option key={role.value} value={role.value}>
                          {({ selected }) => (
                            <div
                              className={`w-full cursor-pointer rounded-md bg-white px-4 py-3 text-start capitalize hover:bg-gray-50`}
                            >
                              <span
                                className={`${
                                  selected ? 'text-blue-700' : 'font-normal'
                                } flex truncate`}
                              >
                                {role.label}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
            </Listbox>
          </label>
        </div>
        <Button
          variant="solid"
          size="lg"
          className="justify-end"
          onClick={onSubmit}
        >
          Send invite
        </Button>
      </div>
    </Modal>
  );
};

export const InviteTeamButton: React.FC = () => {
  const inviteUserModalRef = useRef<ModalRef>(null);
  const { org } = useOrg();

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          if (org.org_plan === 'Free') {
            toast.error('Please upgrade your plan to invite your team');
            return;
          }

          inviteUserModalRef.current?.openModal();
        }}
        className="flex items-center gap-x-1"
      >
        <BiUserPlus className="h-4 w-4" /> Invite team
      </Button>
      <InviteUserFormModal modalRef={inviteUserModalRef} />
    </>
  );
};
