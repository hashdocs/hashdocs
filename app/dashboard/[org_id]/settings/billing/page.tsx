'use client';
import Button from '@/app/_components/button';
import { formatDate } from '@/app/_utils/dateFormat';
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

  const { org } = useOrg();

  const current_plan = org?.org_plan ?? 'Free';

  const upgradePlan = async () => {
    const stripePromise = new Promise<string>(async (resolve, reject) => {
      if (!org) {
        reject(false);
        return;
      }

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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-600">Billing</h1>
      </div>

      {current_plan == 'Free' ? (
        <div className="my-6 grid w-full grid-cols-1 gap-20 text-center lg:grid-cols-3">
          {pricingPlans.map(
            ({ plan, details: { tagline, price, meter, billing_cta } }) => {
              return (
                <div
                  key={plan}
                  className={`relative rounded-2xl border bg-white`}
                >
                  <div className="p-5">
                    <h3 className="font-display my-3 text-center text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500">{tagline}</p>
                    <p className="font-display my-5 text-6xl font-semibold">
                      {price.monthly.currency}
                      {price.monthly.amount}
                    </p>
                    <p className="text-gray-500">{meter}</p>
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
                    ) : (
                      <Button
                        onClick={() => upgradePlan()}
                        size="md"
                        variant={plan == 'Free' ? 'outline' : 'solid'}
                        className={`block w-full rounded-full py-2 font-medium transition-all`}
                        disabled={plan == 'Free'}
                      >
                        {plan == 'Free' ? 'Current plan' : billing_cta}
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
                              className="h-5 w-5 text-gray-400"
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
                                ? 'text-gray-400'
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
      ) : (
        <div className="my-6  flex flex-col gap-y-8 rounded-2xl border bg-white p-16">
          <div className="flex w-full flex-1 flex-row items-center">
            <div className="flex flex-1 basis-1/2 text-sm font-semibold">
              Current Plan
            </div>
            <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-gray-200 bg-gray-50 p-2 font-semibold shadow-inner">
              {current_plan}
            </div>
          </div>
          <div className="flex w-full flex-1 flex-row items-center">
            <div className="flex flex-1 basis-1/2 text-sm font-semibold">
              Number of users
            </div>
            <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-gray-200 bg-gray-50 p-2 font-semibold shadow-inner">
              {org?.members.length}
            </div>
          </div>
          <div className="flex w-full flex-1 flex-row items-center">
            <div className="flex flex-1 basis-1/2 text-sm font-semibold">
              Next billing date
            </div>
            <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-gray-200 bg-gray-50 p-2 font-semibold shadow-inner">
              {org?.stripe_metadata?.billing_cycle_end
                ? formatDate(org.stripe_metadata.billing_cycle_end, 'MMM DD')
                : '-'}
            </div>
          </div>
          <div className="flex w-full flex-1 flex-row items-center">
            <div className="flex flex-1 basis-3/4 text-sm font-semibold"></div>
            <Button onClick={upgradePlan} variant="solid" size="md">
              {'Manage plan'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
