import { Tables } from '@/types';
import clsx from 'clsx';
import Image from 'next/image';

type MemberImageProps = {
  className?: string;
  member?: Tables<'tbl_org_members'>;
};

const MemberImage: React.FC<MemberImageProps> = ({
  className = 'h-7 w-7',
  member,
}) => {
  return (
    <div
      className={clsx(
        'relative flex shrink-0 items-center justify-center font-semibold text-white text-base',
        className
      )}
      aria-hidden="true"
    >
      {member?.member_image ? (
        <Image
          src={member.member_image || ''}
          className="rounded-full"
          alt="logo"
          fill={true}
        />
      ) : (
        <div
          className="flex h-full flex-1 items-center capitalize rounded-full justify-center"
          style={{
            backgroundColor: member?.member_color ?? '#0010ff',
          }}
        >
          {member?.member_name?.charAt(0) ?? member?.email?.charAt(0) ?? '-'}
        </div>
      )}
    </div>
  );
};

export default MemberImage;
