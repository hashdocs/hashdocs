'use client';
import { Menu, Transition } from '@headlessui/react';
import { Placement } from '@popperjs/core';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

type DropdownItem = {
  element: React.ReactNode;
  disabled?: boolean;
  id?: string;
};

type DropdownProps = {
  children: React.ReactNode;
  items: Array<DropdownItem>;
  activeClassName?: string;
  inactiveClassName?: string;
  menuClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  placement?: Placement | undefined;
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  children,
  activeClassName,
  inactiveClassName,
  menuClassName,
  wrapperClassName,
  disabled = false,
  placement = 'bottom-start',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>(
    null!
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null!);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      {
        name: 'arrow',
      },
    ],
    placement: placement,
    strategy: 'absolute',
  });

  useEffect(() => {
    if (buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width;
      setButtonWidth(width);
    }
  }, []);

  return (
    <Menu as="div" className={clsx(wrapperClassName, 'relative')}>
      <>
        <Menu.Button ref={setReferenceElement as React.Ref<HTMLButtonElement>}>
          {children}
        </Menu.Button>
        {!disabled && (
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={clsx(
                'absolute right-0 z-40 flex flex-col items-stretch rounded-md border bg-white p-1 shadow-md',
                menuClassName
              )}
              ref={setPopperElement as React.Ref<HTMLDivElement>}
              style={styles.popper}
              {...attributes.popper}
            >
              {items.map((item, idx) => (
                <Menu.Item
                  key={item.id || idx}
                  disabled={item.disabled}
                  as="div"
                  className="w-full"
                >
                  {({ active }) => (
                    <div
                      className={clsx(
                        'w-full',
                        active ? activeClassName : inactiveClassName
                      )}
                    >
                      {item.element}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        )}
      </>
    </Menu>
  );
};

export default Dropdown;
