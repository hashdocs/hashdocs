import { OrgType } from '@/types';
import clsx from 'clsx';
import Image from 'next/image';

type OrgThumbProps = {
  className?: string;
  org?: OrgType;
};

const OrgThumb: React.FC<OrgThumbProps> = ({
  className = 'h-7 w-7 text-lg',
  org,
}) => {
  return (
    <div
      className={clsx(
        'relative flex shrink-0 items-center justify-center font-black text-white',
        className
      )}
      aria-hidden="true"
    >
      {org?.org_image ? (
        <Image
          src={org.org_image || ''}
          className="rounded-sm"
          alt="logo"
          fill={true}
        />
      ) : (
        <div className="flex h-full flex-1 items-center justify-center rounded-sm bg-blue-700 font-black text-white">
          {org?.org_name?.charAt(0)}
        </div>
      )}
    </div>
  );
};

export default OrgThumb;
