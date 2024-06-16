import {
    features,
    pricingPlans,
} from "@/app/_lib/stripe/constants";
import {
    CheckCircleIcon,
    MinusCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Information on the pricing and billing terms of Hashdocs",
  openGraph: {
    title: "Pricing",
    description: "Information on the pricing and billing terms of Hashdocs",
  },
};

export default async function PricingPage() {
  return (
    <main className="mx-auto flex max-w-screen-xl flex-col items-center p-4 text-center">
      <div className="my-4 flex flex-col gap-y-2 ">
        <h1 className="text-shade-gradient text-3xl font-extrabold sm:text-6xl sm:leading-normal">
          Simple, affordable pricing
        </h1>
        <h2 className="text-xl">No complex tiers or hidden fees</h2>
      </div>

      <div className="my-6 grid grid-cols-1 gap-10 text-center lg:grid-cols-3">
        {pricingPlans.map(
          ({ plan, details: { tagline, price, meter, pricing_cta } }) => {
            return (
              <div
                key={plan}
                className={`relative rounded-2xl bg-white ${
                  plan === "Pro"
                    ? "border-2 border-stratos-default shadow-stratos-line"
                    : "border border-shade-line"
                } shadow-lg`}
              >
                {plan === "Pro" && (
                  <div className="bg-stratos-gradient absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r px-3 py-2 text-sm font-medium text-white">
                    Popular
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-display my-3 text-center text-3xl font-bold">
                    {plan}
                  </h3>
                  <p className="text-shade-gray-500">{tagline}</p>
                  <p className="font-display my-5 text-6xl font-semibold">
                    {price.monthly.currency}
                    {price.monthly.amount}
                  </p>
                  <p className="text-shade-gray-500">{meter}</p>
                </div>
                <ul className="my-6 flex flex-col gap-y-2 px-8">
                  {features.map((feature) => (
                    <li key={feature.defaultText} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {feature[plan].availability === "neutral" ? (
                          <MinusCircleIcon
                            fill="#9CA3AF"
                            className="h-5 w-5 text-white"
                          />
                        ) : feature[plan].availability === "negative" ? (
                          <XCircleIcon
                            fill="rgb(255, 255,255)"
                            className="h-5 w-5 text-shade-disabled"
                          />
                        ) : (
                          <CheckCircleIcon
                            fill="rgb(34, 197,94)"
                            className="h-5 w-5 text-white"
                          />
                        )}
                      </div>
                      {
                        <p
                          className={
                            feature[plan].availability === "negative"
                              ? "text-shade-disabled"
                              : ""
                          }
                        >
                          {feature[plan].customtext ?? feature.defaultText}
                        </p>
                      }
                    </li>
                  ))}
                </ul>
                <div className="p-5">
                  <Link
                    href={
                      plan === "Enterprise"
                        ? "mailto:bharat@hashlabs.dev"
                        : "/settings/billing"
                    }
                    className={`${
                      plan === "Pro"
                        ? "bg-stratos-gradient text-white hover:animate-pulse"
                        : "bg-shade-gradient border border-gray-200 text-white"
                    } block w-full rounded-full py-2 font-medium transition-all`}
                  >
                    {pricing_cta}
                  </Link>
                </div>
              </div>
            );
          }
        )}
      </div>
    </main>
  );
}
