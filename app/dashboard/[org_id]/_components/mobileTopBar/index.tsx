'use client';
import { HashdocsLogo } from '@/app/_components/logo';
import clsx from 'clsx';
import Link from 'next/link';

import { motion, useCycle } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { primaryNavigation } from '../sidebar/nav.constants';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 100% 0)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

export default function MobileTopBar() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const path = usePathname();

  const path_without_org_id = path.split('/').slice(0, 2).join('/');

  const defaultNav =
    primaryNavigation.find((nav) => {
      return path.includes(nav.path);
    }) || primaryNavigation[0];

  const [activeNav, setActiveNav] = useState(defaultNav);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      className={`inset-0 z-[9999] flex h-12 w-full flex-shrink-0 flex-row items-center justify-between gap-x-4 border-b border-gray-200 shadow-sm lg:hidden ${
        isOpen ? '' : 'pointer-events-none'
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 top-0 w-full bg-white"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute top-0 grid w-full gap-3 px-2 py-16"
      >
        {primaryNavigation.map((nav, index) => (
          <MenuItem key={nav.path}>
            <Link
              key={nav.path}
              href={`${path_without_org_id}${nav.path}`}
              onClick={() => setActiveNav(nav)}
              className={clsx(
                nav.path === activeNav.path
                  ? 'bg-gray-200/50 font-semibold text-blue-700'
                  : '',
                'group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-200/50'
              )}
            >
              <div className="flex items-center gap-x-4 whitespace-nowrap">
                {/* <Tooltip
                    content={
                      <div className="flex max-w-xs flex-col items-start gap-y-1 text-start">
                        <span className="text-xs13 font-semibold">
                          {nav.name}
                        </span>
                        <span className="whitespace-normal text-xs11 leading-3">
                          {nav.description}
                        </span>
                      </div>
                    }
                    placement="right"
                  > */}
                <nav.icon
                  className={'h-6 w-6 shrink-0 scale-90'}
                  aria-hidden="true"
                />
                {nav.name}
                {/* </Tooltip> */}
              </div>
            </Link>
          </MenuItem>
        ))}
      </motion.ul>
      <div className={clsx('flex w-full items-center px-2 justify-between')}>
        <HashdocsLogo full size="sm" className="z-[99] !gap-x-0.5" />
        <MenuToggle toggle={toggleOpen} />
      </div>
    </motion.nav>
  );
}

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button onClick={toggle} className="pointer-events-auto z-[99] pt-2">
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.04,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dimensions.current;
};
