import { FaGithub, FaMapMarkedAlt } from "react-icons/fa";
import Link from "next/link";

export default function OSS() {

  return (
    <div className="w-full p-4 backdrop-blur">
      <div className="mx-auto max-w-md text-center sm:max-w-xl">
        <h2 className="text-3xl text-shade-gradient font-extrabold leading-tight text-transparent sm:text-4xl sm:leading-tight">
          Proudly <span className="text-stratos-gradient">open-source</span>
        </h2>
        <p className="mt-5 text-shade-pencil-light sm:text-lg">
          Our source code is available on GitHub - feel free to review, contribute, audit or self-host!
        </p>
      </div>
      <div className="flex items-center justify-center py-10">
      <Link
          href={`https://github.com/users/rbkayz/projects/1`}
          target="_blank"
          rel="noreferrer"
          className="mx-2"
        >
          <div className="flex items-center">
            <div className="flex h-10 items-center space-x-2 rounded-md border  bg-stratos-gradient p-4">
              <FaMapMarkedAlt className="h-5 w-5 text-white" />
              <p className="font-medium text-white">View our roadmap</p>
            </div>
          </div>
        </Link>
        <Link
          href="https://github.com/rbkayz/hashdocs"
          target="_blank"
          rel="noreferrer"
          className="mx-2"
        >
          <div className="flex items-center">
            <div className="flex h-10 items-center space-x-2 rounded-md border bg-shade-pencil-dark p-4">
              <FaGithub className="h-5 w-5 text-white" />
              <p className="font-medium text-white">Star on Github</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}