import Button from '@/app/_components/button';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col items-center p-4 text-center">
      <Link
        href="https://twitter.com/rbkayz/status/1678813872965447681"
        target="_blank"
        className="border-shade-line hover:border-shade-line group mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border bg-white px-7 py-2 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-gray-600 group-hover:text-blue-700">
          Introducing Hashdocs
        </p>
        <FaTwitter className="h-3.5 w-3.5 group-hover:animate-bounce group-hover:text-blue-700" />
      </Link>

      <h1 className="mt-6 text-3xl font-black leading-9 tracking-[0.01rem] text-gray-600 sm:text-6xl">
        An open source
        <br />
        <span className="text-blue-700">Dataroom platform</span>
      </h1>
      <h2 className="mt-5 max-w-xl text-gray-600 sm:text-xl">
        A docsend alternative for secure access to documents with powerful link
        controls and advanced tracking
      </h2>

      <div className="mx-auto mt-10 flex max-w-fit space-x-4">
        <Link href={`/login`}>
          <Button
            variant="solid"
            size="md"
            className="group flex items-center gap-x-1 font-semibold"
          >
            <span>Start for free</span>
            <ArrowRightCircleIcon className="h-5 w-5 text-white group-hover:animate-pulse" />
          </Button>
        </Link>
        <Link href={`https://github.com/hashdocs/hashdocs`} target="_blank">
          <Button
            variant="outline"
            size="md"
            className="group flex items-center gap-x-1 font-semibold"
          >
            <span>Star on Github</span>
            <FaGithub className="h-4 w-4 group-hover:animate-pulse" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
