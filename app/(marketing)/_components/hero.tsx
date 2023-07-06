import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { FaArrowAltCircleRight, FaGithub, FaTwitter } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col items-center p-4 text-center">
      <Link
        href="/"
        target="_blank"
        className="group mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-shade-line bg-white px-7 py-2 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:border-shade-line hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-shade-pencil-light group-hover:text-stratos-default">
          Introducing Hashdocs
        </p>
        <FaTwitter className="h-3.5 w-3.5 group-hover:text-stratos-default group-hover:animate-bounce" />
      </Link>

      <h1 className="font-display mt-5 text-3xl font-extrabold leading-9 text-shade-gradient sm:text-6xl">
        An open source
        <br />
        <span className="text-stratos-gradient">Docsend alternative</span>
      </h1>
      <h2 className="mt-5 max-w-xl sm:text-xl">
       Manage secure access to your sensitive documents with <br/> powerful link
        controls and advanced tracking
      </h2>

      <div className="mx-auto mt-10 flex max-w-fit space-x-4">
        <Link
          className="bg-stratos-default hover:bg-stratos-default/80 flex items-center justify-center space-x-2 rounded-lg px-5 py-2 shadow-lg transition-all text-white group font-semibold"
          href="/login"
        >
          <p className="text-sm">Start for free</p>
          <ArrowRightCircleIcon className="h-5 w-5 text-white group-hover:animate-pulse" />
        </Link>
        <Link
          className="flex items-center justify-center font-semibold space-x-2 rounded-lg border bg-white px-5 py-2 shadow-lg transition-all hover:border-shade-pencil-dark"
          href="https://github.com/hashdocs/hashdocs"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm">Star on GitHub</p>
          <FaGithub className="h-5 w-5 text-black" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
