'use client';
import Button from '@/app/_components/button';
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useOrg from '../../_provider/useOrg';
import { stripeAction } from '../_actions/stripe.actions';
import { features, pricingPlans } from './constants';

/*=========================================== CONSTANTS ===========================================*/

export default function BillingPage() {
  const router = useRouter();

  const { org, user } = useOrg();

  const current_plan = org.org_plan;

  const upgradePlan = async () => {
    const stripePromise = new Promise<string>(async (resolve, reject) => {
      const { url } = await stripeAction({
        quantity: 1,
        org,
        checkout: current_plan === 'Free' ? true : false,
      });

      if (!url) {
        reject(false);
        return;
      }

      resolve(url);
      router.push(url);
      return;
    });

    toast.promise(stripePromise, {
      loading: 'Redirecting to Stripe...',
      success: (url: string) => (
        <p>
          Please complete the transaction in the{' '}
          <Link href={url} className="text-blue-700 underline">
            Stripe checkout page
          </Link>
        </p>
      ),
      error: 'Error redirecting to Stripe',
    });
  };

  return (
    <div className="flex flex-col gap-y-2 p-4">
      {/* <div className="font-semibold uppercase text-gray-500">
        BILLING
      </div>
      <div className="flex w-full flex-1 flex-col items-center gap-y-6 rounded-md p-8 text-gray-500 shadow-sm ">
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Current Plan
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-gray-200 bg-white p-2 font-semibold shadow-inner">
            {current_plan}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Billing cycle
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-gray-200 bg-white p-2 font-semibold shadow-inner">
            {org.stripe_metadata?.billing_cycle_start &&
              formatDate(org.stripe_metadata.billing_cycle_start, "MMM DD")}{" "}
            -{" "}
            {org.stripe_metadata?.billing_cycle_end &&
              formatDate(org.stripe_metadata.billing_cycle_end, "MMM DD")}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-3/4 text-sm font-semibold"></div>
          <Button
            onClick={handlePlan}
            variant="solid"
            size="md"
          >
            {current_plan === "Free" ? "Upgrade plan" : "Manage plan"}
          </Button>
        </div>
      </div> */}
      {/* <div className="font-semibold uppercase text-gray-500">
        Plans
      </div> */}
      <div className="flex w-full flex-1 flex-col items-center rounded-md px-10 py-4 text-gray-500 shadow-sm ">
        <div className="my-6 grid w-full grid-cols-1 gap-20 text-center lg:grid-cols-3">
          {pricingPlans.map(
            ({ plan, details: { tagline, price, meter, billing_cta } }) => {
              return (
                <div
                  key={plan}
                  className={`border-shade-line relative rounded-2xl border bg-white`}
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
                    {plan === 'Enterprise' ? (
                      <Button
                        onClick={() =>
                          window.open(`mailto:bharat@hashdocs.org`, '_blank')
                        }
                        variant="outline"
                        size="md"
                        className="w-full rounded-md"
                      >
                        Contact us
                      </Button>
                    ) : plan === 'Pro' ? (
                      <Button
                        onClick={() => upgradePlan()}
                        size="md"
                        className={`block w-full rounded-full py-2 font-medium transition-all`}
                      >
                        {plan === current_plan ? 'Manage plan' : billing_cta}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => upgradePlan()}
                        size="md"
                        variant="outline"
                        className={`w-full rounded-full py-2 font-medium transition-all`}
                      >
                        {plan === current_plan ? 'Current plan' : billing_cta}
                      </Button>
                    )}
                  </div>
                  <ul className="my-6 flex flex-col gap-y-2 px-8">
                    {features.map((feature) => (
                      <li key={feature.defaultText} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {feature[plan].availability === 'neutral' ? (
                            <MinusCircleIcon
                              fill="#9CA3AF"
                              className="h-5 w-5 text-white"
                            />
                          ) : feature[plan].availability === 'negative' ? (
                            <XCircleIcon
                              fill="rgb(255, 255,255)"
                              className="text-shade-disabled h-5 w-5"
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
                              feature[plan].availability === 'negative'
                                ? 'text-shade-disabled'
                                : ''
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
    </div>
  );
}
