'use client';

import Button from '@/app/_components/button';
import Input from '@/app/_components/input';
import OrgThumb from '@/app/_components/orgThumb';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useOrg from '../../../_provider/useOrg';
import { updateOrg } from '../_actions/updateOrg';
import ImageUpload from './imageUpload';

export default function UpdateOrgForm() {
  const { org_id } = useParams() as { org_id: string };

  const { org } = useOrg();
  const router = useRouter();

  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleInputChange = () => {
    setIsFormChanged(true);
  };

  return (
    <form
      className="grid space-y-7 text-sm text-gray-600"
      action={async (form) => {
        form.set('org_id', org_id);
        const updatePromise = updateOrg(form).finally(() => router.refresh());
        await toast.promise(updatePromise, {
          loading: 'Updating org details...',
          success: 'Organization details updated successfully!',
          error: (e) =>
            `An error occured in updated org details! Please try again`,
        });
      }}
    >
      <label className="grid space-y-3">
        <span className="font-medium">Org Name</span>
        <Input
          className="max-w-sm"
          inputProps={{
            name: 'org_name',
            placeholder: 'e.g. Hashdocs',
            defaultValue: org?.org_name || '',
            onChange: handleInputChange,
          }}
        />
      </label>
      <div className="grid gap-y-4">
        <div className="grid gap-y-1">
          <span className="font-medium">Logo</span>
          <p className="text-xs text-gray-400">
            Set your organization logo. Recommended size is 256 x 256 px.
          </p>
        </div>
        <label className="w-min">
          <ImageUpload
            inputProps={{ name: 'org_image', onClick: handleInputChange }}
            wrapperClassName="cursor-pointer transition-all hover:scale-110 "
            fallback={<OrgThumb className="h-full w-full text-4xl" org={org} />}
          />
        </label>
      </div>
      <div>
        <Button
          size="sm"
          className={clsx("px-6", !isFormChanged ? 'bg-gray-400 border-gray-400' : '')}
          disabled={!isFormChanged}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
