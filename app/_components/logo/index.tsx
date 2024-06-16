import clsx from 'clsx';
import Image from 'next/image';

export type HashdocsLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'scale-50',
  md: 'scale-75',
  lg: '',
};

export const HashdocsLogo = ({ size = 'lg', className }: HashdocsLogoProps) => {
  return (
    <div
      className={clsx(
        'relative h-12 w-9 overflow-hidden rounded-md',
        sizeMap[size],
        className
      )}
    >
      <Image
        src={'/assets/hashdocs_gradient.svg'}
        fill={true}
        alt={'Hashdocs'}
      />
    </div>
  );
};
