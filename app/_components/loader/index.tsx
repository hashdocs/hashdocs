import clsx from 'clsx';
import { PuffLoader } from 'react-spinners';

const Loader: React.FC<{
  size?: 'lg' | 'sm' | 'xs';
}> = ({ size = 'lg' }) => {
  return (
    <div
      className={clsx(
        'flex h-full w-full flex-1 flex-col items-center justify-center rounded-lg',
        { lg: '', sm: 'scale-75', xs: 'scale-50' }[size]
      )}
    >
      <PuffLoader color='#9ca3af' size={40} />
    </div>
  );
};

export default Loader;
