import clsx from 'clsx';
import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

const isClickInsideRectangle = (
  e: React.MouseEvent<HTMLDialogElement, MouseEvent>,
  element: HTMLElement
) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
};

const Container: React.FC<ContainerProps> = ({ children, open, onClose }) => {
  const ref = React.useRef<HTMLDialogElement>(null!);

  React.useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) =>
        ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
      }
      className={clsx(
        'w-full max-w-sm bg-white backdrop:bg-white/70 rounded-md p-0 shadow-lg',
        open && 'overflow-hidden'
      )}
    >
      {children}
    </dialog>
  );
};

export default Container;
