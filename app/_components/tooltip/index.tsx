'use client';

import clsx from 'clsx';
import React, { LegacyRef, useState } from 'react';
import { usePopper } from 'react-popper';

export type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?:
    | 'top'
    | 'top-end'
    | 'top-start'
    | 'right'
    | 'right-end'
    | 'right-start'
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left'
    | 'left-end'
    | 'left-start';
};

const Tooltip: React.FC<TooltipProps> = ({ children, content, placement }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>(
    null!
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null!);
  const [arrowElement, setArrowElement] = useState<HTMLSpanElement>(null!);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
    ],
    placement: placement || 'bottom',
    strategy: 'absolute',
  });

  const showTooltip = () => {
    if (popperElement) popperElement.setAttribute('data-show', 'true');
  };

  const hideTooltip = () => {
    if (popperElement) popperElement.removeAttribute('data-show');
  };

  return (
    <>
      <div
        role="button"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="flex w-max text-xs "
        ref={setReferenceElement as LegacyRef<HTMLDivElement>}
      >
        {children}
      </div>
      <div
        className="group/popperel invisible relative z-50 rounded-md border bg-white p-2 text-xs font-medium text-gray-600 opacity-0 shadow-lg data-[show=true]:visible data-[show=true]:opacity-100 max-md:hidden"
        ref={setPopperElement as LegacyRef<HTMLDivElement>}
        style={styles.popper}
        {...attributes.popper}
      >
        {content}
        <span
          className={clsx(
            `transition-["top 0.3s ease-in, bottom 0.3s ease-in, left 0.3s ease-in, right 0.3s ease-in"] invisible absolute h-2 w-2 bg-inherit`,
            `before:transition-["top 0.3s ease-in, bottom 0.3s ease-in, left 0.3s ease-in, right 0.3s ease-in"] before:invisible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:shadow-lg before:content-[""]`,
            'group-data-[popper-placement^=top]/popperel:-bottom-1 group-data-[popper-placement^=top]/popperel:before:border-b group-data-[popper-placement^=top]/popperel:before:border-r',
            'group-data-[popper-placement^=right]/popperel:-left-1 group-data-[popper-placement^=right]/popperel:before:border-b group-data-[popper-placement^=right]/popperel:before:border-l',
            'group-data-[popper-placement^=bottom]/popperel:-top-1 group-data-[popper-placement^=bottom]/popperel:before:border-l group-data-[popper-placement^=bottom]/popperel:before:border-t',
            'group-data-[popper-placement^=left]/popperel:-right-1 group-data-[popper-placement^=left]/popperel:before:border-r group-data-[popper-placement^=left]/popperel:before:border-t',
            'group-data-[show=true]/popperel:before:visible'
          )}
          ref={setArrowElement as LegacyRef<HTMLSpanElement>}
          style={styles.arrow}
          {...attributes.arrow}
        ></span>
      </div>
    </>
  );
};

export default Tooltip;
