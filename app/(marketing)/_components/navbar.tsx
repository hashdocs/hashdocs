import Button from '@/app/_components/button';
import { HashdocsLogo } from '@/app/_components/logo';
import clsx from 'clsx';
import Link from 'next/link';

const navbarLinks = [
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Roadmap', href: 'https://github.com/hashdocs/hashdocs/issues' },
];

export default function Navbar() {
  return (
    <div
      className={clsx(
        `sticky inset-x-0 top-0 z-30 w-full bg-gray-50 bg-opacity-90 transition-all`
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 ">
        <HashdocsLogo size="md" full link />

        <div className="hidden items-center space-x-6 sm:flex">
          {navbarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded-md font-semibold capitalize text-gray-600 transition-colors ease-out hover:text-blue-700`}
            >
              {link.name}
            </Link>
          ))}
          <Link href={`/login`}>
            <Button size="sm" variant="solid" className="font-semibold">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
