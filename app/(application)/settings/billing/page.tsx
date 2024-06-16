"use client";
import Loader from "@/app/_components/navigation/loader";
import { features, pricingPlans } from "@/app/_lib/stripe/constants";
import { classNames } from "@/app/_utils/classNames";
import { formatDate } from "@/app/_utils/dateFormat";
import {
    CheckCircleIcon,
    MinusCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { PopupButton } from "react-calendly";
import toast from "react-hot-toast";
import { UserContext } from "../../_components/userProvider";

/*=========================================== CONSTANTS ===========================================*/

export default function BillingPage() {
  const router = useRouter();

  const _userContext = useContext(UserContext);

  if (!_userContext) {
    return <Loader />;
  }

  const { org, user } = _userContext;

  if (!org) {
    return <Loader />;
  }

  const current_plan = org.stripe_product_plan ?? "Free";

  const handlePlan = async () => {
    const stripePromise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/stripe", {
        method: current_plan === "Free" ? "POST" : "PUT",
        body: JSON.stringify({
          lookup_key: "pro_monthly",
          quantity: 1,
          stripe_customer_id: org.stripe_customer_id,
          org_id: org.org_id,
        }),
      });

      if (!res.ok) {
        reject("error");
        return;
      }

      const { url } = (await res.json()) as {
        url: string;
      };

      resolve("success");
      router.push(url);
      return;
    });

    toast.promise(stripePromise, {
      loading: "Redirecting to Stripe...",
      success: "Please complete the transaction in the Stripe checkout page",
      error: "Error redirecting to Stripe",
    });
  };

  return (
    <main className="mb-8 flex flex-col space-y-2" id="billing">
      <div className="font-semibold uppercase text-shade-gray-500">
        Preferences
      </div>
      <div className="flex w-full flex-1 flex-col items-center gap-y-6 rounded-md bg-white p-8 text-shade-gray-500 shadow-sm ">
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Current Plan
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-shade-line bg-gray-50 p-2 font-semibold shadow-inner">
            {current_plan}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Billing cycle
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-shade-line bg-gray-50 p-2 font-semibold shadow-inner">
            {org.billing_cycle_start &&
              formatDate(org.billing_cycle_start, "MMM DD")}{" "}
            -{" "}
            {org.billing_cycle_end &&
              formatDate(org.billing_cycle_end, "MMM DD")}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-3/4 text-sm font-semibold"></div>
          <button
            onClick={handlePlan}
            className={classNames(
              "rounded-md border  p-2 font-semibold shadow",
              current_plan === "Free"
                ? "bg-stratos-default text-white  hover:bg-stratos-default/80"
                : "border bg-shade-line"
            )}
          >
            {current_plan === "Free" ? "Upgrade plan" : "Manage plan"}
          </button>
        </div>
      </div>
      <div className="pt-8 font-semibold uppercase text-shade-gray-500">
        Plans
      </div>
      <div className="flex w-full flex-1 flex-col items-center rounded-md bg-white px-10 py-4 text-shade-gray-500 shadow-sm ">
        <div className="my-6 grid w-full grid-cols-1 gap-20 text-center lg:grid-cols-3">
          {pricingPlans.map(
            ({ plan, details: { tagline, price, meter, billing_cta } }) => {
              return (
                <div
                  key={plan}
                  className={`relative rounded-2xl border border-shade-line bg-white`}
                >
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
                  <div className="p-5">
                    {plan === "Enterprise" ? (
                      <PopupButton
                        url="https://calendly.com/swapnika/hashdocs"
                        prefill={{
                          name: user?.user_metadata?.name ?? "",
                          email: user?.email,
                        }}
                        className="bg-shade-gradient text-white block w-full rounded-full border border-shade-line py-2 font-medium transition-all"
                        /*
                         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                         * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                         */
                        rootElement={document.getElementById("app")!}
                        text="Contact us"
                      />
                    ) : (
                      <button
                        onClick={handlePlan}
                        className={`${
                          plan === current_plan
                            ? "bg-shade-line"
                            : `${
                                plan === "Pro"
                                  ? "bg-stratos-gradient"
                                  : "bg-shade-gradient"
                              } text-white`
                        } block w-full rounded-full border border-shade-line py-2 font-medium transition-all`}
                      >
                        {plan === current_plan ? "Current plan" : billing_cta}
                      </button>
                    )}
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
                </div>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}
