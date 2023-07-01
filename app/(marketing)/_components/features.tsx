"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { AnimatePresence, motion } from "framer-motion";
import { Link2 } from "lucide-react";

const featureList = [
  {
    key: "powerful-link-controls",
    title: "Powerful link controls",
    // icon: <Chart className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "Manage access control for your links with advanced settings such as restricted domains, password protection, expiry conditions and more",
    cta: (
      <Link
        href="/stats/github"
        className="block max-w-fit rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
      >
        View demo
      </Link>
    ),
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/analytics.mp4",
    thumbnail: "/_static/features/analytics.png",
  },
  {
    key: "advanced-tracking",
    title: "Advanced tracking",
    // icon: <Airplay className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "Critical insights on your link views such as visitor emails, location, device, and time spent across pages",
    cta: (
      <a
        href="https://app.dub.sh"
        target="_blank"
        rel="noreferrer"
        className="block max-w-fit rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
      >
        Create your project
      </a>
    ),
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/custom-domain.mp4",
  },
  {
    key: "secure-viewer",
    title: "Secure document viewer",
    // icon: <Link2 className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "Secure document viewer with watermarks, no-print, no-download, and no-copy settings",
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/link.mp4",
  },
  {
    key: "custom-data-room",
    title: "Customize your data room",
    // icon: <Photo className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "Customize your data room with your logo, brand identity, and custom domains",
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/og.mp4",
  },
  {
    key: "simple-pricing",
    title: "Simple pricing",
    // icon: <QR className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "No complex tiers. We have a limited free plan, and an all-access pro tier!",
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/qr.mp4",
  },
  {
    key: "manage-team",
    title: "Collaborate with your team",
    // icon: <Users className="h-5 w-5 text-shade-pencil-light" />,
    description:
      "Invite your team members to collaborate with fine-grained permissions (coming soon)",
    demo: "https://d2vwwcvoksz7ty.cloudfront.net/team.mp4",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);


  return (
    <div id="features" className="w-full items-center flex flex-col p-4">
      {featureList.map(({ key, demo }) => (
        // preload videos
        <link key={key} rel="preload" as="video" href={demo} />
      ))}
      <div className="my-10 h-[840px] max-w-screen-xl w-full overflow-hidden rounded-xl border border-shade-line bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur lg:h-[630px]">
        <div className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-3">
          <Accordion
            type="single"
            defaultValue="analytics"
            onValueChange={(e) => {
              setActiveFeature(featureList.findIndex(({ key }) => key === e));
            }}
          >
            {featureList.map(({ key, title, description, cta }) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>
                  <div className="flex items-center space-x-3 p-3">
                    {/* {icon} */}
                    <h3 className="text-base font-semibold text-shade-pencil-light">
                      {title}
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-3">
                    <p className="mb-4 text-sm text-shade-pencil-light">
                      {description}
                    </p>
                    {key === "link" || key === "social" ? (
                      <button
                        className="block max-w-fit rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                      >
                        View demo
                      </button>
                    ) : key === "qr" ? (
                      <button
                        className="block max-w-fit rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                      >
                        View demo
                      </button>
                    ) : (
                      cta
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {featureList.map((feature, index) => {
                if (index === activeFeature) {
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{
                        y: 10,
                        opacity: 0,
                      }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{
                        y: -10,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.15,
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="relative min-h-[600px] w-full overflow-hidden whitespace-nowrap rounded-2xl bg-white shadow-2xl lg:mt-10 lg:w-[800px]"
                    >
                      <video
                        autoPlay
                        muted
                        loop
                        width={800}
                        height={600}
                        poster={feature.thumbnail}
                      >
                        <source src={feature.demo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </motion.div>
                  );
                }
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}