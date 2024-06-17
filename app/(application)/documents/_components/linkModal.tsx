import Button from '@/app/_components/button';
import Modal, { ModalRef } from '@/app/_components/modal';
import Switch from '@/app/_components/switch';
import { DocumentType, Tables, TablesUpdate } from '@/types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useDocument from '../_provider/useDocument';

export type LinkModalProps = {
  modalRef: React.RefObject<ModalRef>;
  document: DocumentType;
  link?: Tables<'tbl_links'>;
};

const LinkModal: React.FC<LinkModalProps> = ({ modalRef, document, link }) => {
  const [linkValue, setLinkValue] = useState<TablesUpdate<'tbl_links'>>(
    link ?? {}
  );

  const { handleLinkToggle, handleLinkDelete, handleLinkUpdate } =
    useDocument();

  return (
    <Modal ref={modalRef} className="w-full max-w-xl">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between gap-x-4">
          <div className="text-sm leading-6">
            <label className="font-medium">Link Name</label>
            <p className="text-xs text-gray-500/80">
              {'Enter the organization or recipient name'}
            </p>
          </div>
          <input
            name="link_name"
            id="link_name"
            onChange={(e) =>
              setLinkValue({ ...linkValue, link_name: e.target.value })
            }
            value={linkValue?.link_name}
            className=" w-full max-w-[16rem] rounded border px-2 py-2 text-sm font-normal shadow-inner outline-0 placeholder:text-gray-400"
            placeholder="e.g. Hooli Ventures or Gavin Belson"
            maxLength={30}
            autoFocus={!linkValue?.link_id}
          />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="text-sm leading-6">
            <label className="font-medium">Status</label>
            <p className="text-xs text-gray-500/80">
              {'Change link status to active or inactive'}
            </p>
          </div>

          <Switch
            enabled={linkValue?.is_active ?? true}
            setEnabled={(checked) =>
              setLinkValue({ ...linkValue, is_active: checked })
            }
            disabled={!document.is_enabled}
            callback={
              link ? (checked) => handleLinkToggle({ checked, link }) : () => {}
            }
          ></Switch>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <p className="pr-3">LINK SETTINGS</p>
          <div className=" h-[1px] flex-grow bg-gray-200"></div>
        </div>
        <div className="hashdocs-scrollbar flex h-96 flex-col gap-y-6">
          <div className="flex flex-col">
            <LinkModalCheckBox
              isChecked={linkValue?.is_email_required ?? false}
              setIsChecked={(checked) =>
                setLinkValue({ ...linkValue, is_email_required: checked })
              }
              id={'required-email-checkbox'}
              name={'required-email-checkbox'}
              label={'Email required'}
              disabled={false}
              description={
                'Viewers need to enter their email to access the document'
              }
            />
            <motion.div
              initial={linkValue?.is_email_required ?? false}
              animate={linkValue?.is_email_required ? 'open' : 'closed'}
              variants={{
                open: { height: 'auto', opacity: 1 },
                closed: { height: 0, opacity: 0 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <AnimatePresence initial={linkValue?.is_email_required ?? false}>
                {
                  <div className="accordion-content ml-7 mt-4 flex w-full flex-col space-y-4">
                    <LinkModalCheckBox
                      isChecked={linkValue?.is_verification_required ?? false}
                      setIsChecked={(checked) =>
                        setLinkValue({
                          ...linkValue,
                          is_verification_required: checked,
                        })
                      }
                      id={'verify-email-checkbox'}
                      name={'verify-email-checkbox'}
                      label={'Verify Email (coming soon)'}
                      description={
                        'Viewers will be sent a confirmation link to verify their email'
                      }
                      disabled
                    />
                    <LinkModalCheckBox
                      isChecked={linkValue?.is_domain_restricted ?? false}
                      setIsChecked={(checked) =>
                        setLinkValue({
                          ...linkValue,
                          is_domain_restricted: checked,
                        })
                      }
                      id={'restrict-domains-checkbox'}
                      name={'restrict-domains-checkbox'}
                      label={'Restrict Domains'}
                      description={
                        'Restrict viewer access to select email domains or addresses'
                      }
                      disabled={false}
                    />
                    <textarea
                      name="domains"
                      id="domains"
                      onChange={(e) =>
                        setLinkValue({
                          ...linkValue,
                          restricted_domains: e.target.value,
                        })
                      }
                      className={clsx(
                        'ml-7 w-full max-w-[20rem] rounded !border-gray-200 px-2 py-2 text-sm font-normal !shadow-inner !outline-none placeholder:text-gray-400',
                        !linkValue?.is_domain_restricted
                          ? 'pointer-events-none bg-gray-200/20'
                          : ''
                      )}
                      placeholder="e.g. gmail.com, hooli.com, sequoia.com"
                      value={linkValue?.restricted_domains ?? undefined}
                      disabled={!linkValue?.is_domain_restricted}
                      style={{
                        maxHeight: `128px`,
                        minHeight: `38px`,
                      }}
                    />
                  </div>
                }
              </AnimatePresence>
            </motion.div>
          </div>
          <div className="flex flex-col">
            <LinkModalCheckBox
              isChecked={linkValue?.is_expiration_enabled ?? false}
              setIsChecked={(checked) =>
                setLinkValue({ ...linkValue, is_expiration_enabled: checked })
              }
              id={'expiry-checkbox'}
              name={'expiry-checkbox'}
              label={'Expiration settings'}
              disabled={false}
              description={
                'Set the link to automatically be disabled after a certain date'
              }
            />
            <motion.div
              initial={linkValue?.is_expiration_enabled ?? false}
              animate={linkValue?.is_expiration_enabled ? 'open' : 'closed'}
              variants={{
                open: { height: 'auto', opacity: 1 },
                closed: { height: 0, opacity: 0 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <AnimatePresence
                initial={linkValue?.is_expiration_enabled ?? false}
              >
                {
                  <div className="accordion-content ml-7 mt-4 flex w-full flex-col">
                    <DatePicker
                      selected={
                        linkValue?.expiration_date
                          ? new Date(linkValue?.expiration_date)
                          : null
                      }
                      onChange={(date) =>
                        setLinkValue({
                          ...linkValue,
                          expiration_date: date?.toISOString(),
                        })
                      }
                      dateFormat={'MMM d, yyyy'}
                      className="!rounded !border-gray-200 px-2 py-2 !text-sm font-normal !shadow-inner placeholder:text-gray-400"
                      calendarClassName="font-inter text-shade-disabled rounded-sm"
                      // minDate={new Date()}
                    />
                    {dayjs().diff(dayjs(linkValue?.expiration_date), 'd') >
                      0 && (
                      <p className="text-xs text-red-500">
                        Warning! Link is inactive because date is in the past
                      </p>
                    )}
                  </div>
                }
              </AnimatePresence>
            </motion.div>
          </div>
          <LinkModalCheckBox
            isChecked={linkValue?.is_download_allowed ?? false}
            setIsChecked={(checked) =>
              setLinkValue({ ...linkValue, is_download_allowed: checked })
            }
            id={'download-allowed-checkbox'}
            name={'download-allowed-checkbox'}
            label={'Allow downloads'}
            disabled={false}
            description={'Viewers can download a copy of the document'}
          />
          <div className="flex flex-col gap-y-4">
            <LinkModalCheckBox
              isChecked={linkValue?.is_password_required ?? false}
              setIsChecked={(checked) =>
                setLinkValue({ ...linkValue, is_password_required: checked })
              }
              id={'password-required-checkbox'}
              name={'password-required-checkbox'}
              label={'Password'}
              disabled={false}
              description={
                'Viewers need to enter the password to view the document'
              }
            />
            <input
              name="link_name"
              id="link_name"
              onChange={(e) =>
                setLinkValue({ ...linkValue, link_password: e.target.value })
              }
              value={linkValue?.link_password ?? undefined}
              className={clsx(
                'ml-7 w-full max-w-[16rem] rounded border px-2 py-2 text-sm font-normal shadow-inner outline-0 placeholder:text-gray-400',
                !linkValue?.is_password_required
                  ? '!cursor-not-allowed bg-gray-200/20'
                  : ''
              )}
              placeholder="Enter password"
              maxLength={30}
              autoFocus={!linkValue?.link_id}
              disabled={!linkValue?.is_password_required}
            />
          </div>
          <LinkModalCheckBox
            isChecked={linkValue?.is_watermarked ?? false}
            setIsChecked={(checked) =>
              setLinkValue({ ...linkValue, is_watermarked: checked })
            }
            id={'watermarked-checkbox'}
            name={'watermarked-checkbox'}
            label={'Watermark (coming soon)'}
            description={
              "All files are watermarked with the viewer's email. Custom watermarks are coming soon"
            }
            disabled
          />
        </div>
        <div className="flex items-center justify-between">
          {
            <Button
              size="sm"
              variant="link"
              onClick={() => link && handleLinkDelete({ link })}
              className={
                link?.link_id
                  ? 'text-red-600'
                  : 'pointer-events-none text-white'
              }
              disabled={!link?.link_id}
            >
              Delete Link
            </Button>
          }
          <div className="flex items-center justify-end gap-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => modalRef.current?.closeModal()}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              size="sm"
              onClick={() => handleLinkUpdate({ link: linkValue, document }).then(() => modalRef.current?.closeModal())}
            >
              {link?.link_id ? 'Save changes' : 'Create new link'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function LinkModalCheckBox({
  isChecked,
  setIsChecked,
  id,
  name,
  label,
  description,
  disabled = true,
}: {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  id: string;
  name: string;
  label: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          name={name}
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          type="checkbox"
          disabled={disabled}
          className={clsx(
            'mt-0.5 !h-3.5 !w-3.5 !rounded-sm !border-gray-400/50 !text-blue-700 focus:ring-white',
            disabled ? '!cursor-not-allowed !bg-gray-400/50' : 'cursor-pointer'
          )}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label
          htmlFor={id}
          className={clsx(
            'font-medium',
            isChecked ? '' : 'text-gray-500',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {label}
        </label>
        <p className="text-xs text-gray-500/80">{description}</p>
      </div>
    </div>
  );
}

export default LinkModal;
