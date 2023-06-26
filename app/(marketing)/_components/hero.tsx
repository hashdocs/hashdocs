import Link from "next/link";

const Hero = () => {
  return (
    <div className="mx-auto my-10 px-2.5 text-center sm:px-0 max-w-screen-xl items-center flex flex-col">
      <Link
        href="/changelog/team-invites"
        className="group mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-gray-700">
          Introducing hashdocs
        </p>
        {/* <ExpandingArrow className="-ml-1 h-3.5 w-3.5" /> */}
      </Link>

      <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]">
        Securely share docs with
        <br />
        <span className="text-stratos-gradient">
          trackable links
        </span>
      </h1>
      <h2 className="mt-5 sm:text-xl max-w-xl">
        hashdocs is an open-source Docsend alternative <br/> with powerful link controls and realtime tracking
      </h2>

      <div className="mx-auto mt-10 flex max-w-fit space-x-4">
        <a
          href="https://app.dub.sh/register"
          className="rounded-full bg-stratos-gradient px-5 py-2 text-sm text-white shadow-lg transition-all"
        >
          Start For Free
        </a>
        <a
          className="flex items-center justify-center space-x-2 rounded-full border bg-white px-5 py-2 shadow-lg transition-all hover:border-gray-800"
          href="https://dub.sh/github"
          target="_blank"
          rel="noreferrer"
        >
          {/* <Github className="h-5 w-5 text-black" /> */}
          <p className="text-sm">Star on GitHub</p>
        </a>
      </div>
    </div>
  );
};

export default Hero;