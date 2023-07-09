import { FeatureProps, PlanProps, PlanType } from "@/types/billing.types";

export const pricingItems = [
  {
    plan: "Free",
    tagline: "For early startups",
    meter: "free forever",
    features: [
      { text: "Advanced link controls" },
      {
        text: "Unlimited tracked views",
      },
      {
        text: "Unlimited log history",
      },
      {
        text: "Advanced link features",
      },
      {
        text: "Up to 1 document",
        neutral: true,
      },
      {
        text: "Up to 3 links",
        neutral: true,
      },
      { text: "Team management", negative: true },
      { text: "Custom domains", negative: true },
      { text: "Custom branding", negative: true },
      { text: "Integrations (slack, mail)", negative: true },
      { text: "Data room (coming soon)", negative: true },
      { text: "Signatures (coming soon)", negative: true },
      { text: "Priority support", negative: true },
    ],
    cta: "Start for free",
    billing_cta: "Downgrade to free",
  },
  {
    plan: "Pro",
    tagline: "For larger teams with multiple docs",
    meter: "per user per month",
    features: [
      { text: "Advanced link controls" },
      {
        text: "Unlimited tracked views",
      },
      {
        text: "Unlimited log history",
      },
      {
        text: "Advanced link features",
      },
      {
        text: "Unlimited documents",
      },
      {
        text: "Unlimited links",
      },
      { text: "Team management" },
      { text: "Integrations (slack, mail)" },
      { text: "Data room (early access)", negative: true },
      { text: "Signatures (early access)", negative: true },
      { text: "Custom domains", negative: true },
      { text: "Custom branding", negative: true },
      { text: "Priority support" },
    ],
    cta: "Get started",
    billing_cta: "Upgrade to pro",
  },
  {
    plan: "Enterprise",
    tagline: "For businesses with custom needs",
    meter: "custom billing",
    features: [
      { text: "Advanced link controls" },
      {
        text: "Unlimited tracked views",
      },
      {
        text: "Unlimited log history",
      },
      {
        text: "Advanced link features",
      },
      {
        text: "Unlimited documents",
      },
      {
        text: "Unlimited links",
      },
      { text: "Team management" },
      { text: "Integrations (slack, mail)" },
      { text: "Data room (early access)" },
      { text: "Signatures (early access)" },
      { text: "Custom domains" },
      { text: "Custom branding" },
      { text: "Priority support" },
    ],
    cta: "Contact us",
    billing_cta: "Contact us",
  },
];

export const features: FeatureProps[] = [
  {
    defaultText: "Advanced link controls",
    Free: {
      availability: "positive",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Unlimited tracked views",
    Free: {
      availability: "positive",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Unlimited log history",
    Free: {
      availability: "positive",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Secure document viewer",
    Free: {
      availability: "positive",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Unlimited documents",
    Free: {
      availability: "neutral",
      customtext: "Up to 1 document",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Unlimited links",
    Free: {
      availability: "neutral",
      customtext: "Up to 3 links",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Team management",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Integrations (slack, mail)",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Data room (coming soon)",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "negative",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Signatures (coming soon)",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "negative",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Custom domains",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "negative",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Custom branding",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "negative",
    },
    Enterprise: {
      availability: "positive",
    },
  },
  {
    defaultText: "Priority support",
    Free: {
      availability: "negative",
    },
    Pro: {
      availability: "positive",
    },
    Enterprise: {
      availability: "positive",
    },
  },
];

export const pricingPlansObject: PlanProps = {
  Free: {
    product_id: "prod_ODVMnH7NAiQqWr",
    price: {
      monthly: {
        amount: 0,
        currency: "$",
        price_id: "",
      },
      annually: {
        amount: 0,
        currency: "$",
        price_id: "",
      },
    },
    tagline: "For individuals",
    meter: "free forever",
    pricing_cta: "Start for free",
    billing_cta: "Switch to free",
  },
  Pro: {
    product_id: "prod_ODVNC1tgbRXUcs",
    price: {
      monthly: {
        amount: 15,
        currency: "$",
        price_id: "price_1NR4MrHUVtdp8pCHXbO1USHP",
      },
      annually: {
        amount: 150,
        currency: "$",
        price_id: "price_1NR4MrHUVtdp8pCHXbO1USHP",
      },
    },
    tagline: "For startups and small teams",
    meter: "per user per month",
    pricing_cta: "Get started",
    billing_cta: "Upgrade to Pro",
  },
  Enterprise: {
    product_id: "prod_ODW3vVHr37hIl4",
    price: {
      monthly: {
        amount: "-",
        currency: "",
        price_id: "",
      },
      annually: {
        amount: "-",
        currency: "",
        price_id: "",
      },
    },
    tagline: "For larger teams with custom needs",
    meter: "custom billing",
    pricing_cta: "Contact us",
    billing_cta: "Contact us",
  },
};

export const pricingPlans = Object.entries(pricingPlansObject).map(
  ([plan, details]) => ({ plan: plan as PlanType, details })
);

export const pricingPlansArray = pricingPlans.reduce(
  (
    accumulator: { price_id: string; price_plan: PlanType }[],
    { plan, details }
  ) => {
    const monthlyPriceId = details.price.monthly.price_id;
    const annuallyPriceId = details.price.annually.price_id;

    if (monthlyPriceId) {
      accumulator = [
        ...accumulator,
        { price_id: monthlyPriceId, price_plan: plan },
      ];
    }

    if (annuallyPriceId) {
      accumulator = [
        ...accumulator,
        { price_id: annuallyPriceId, price_plan: plan },
      ];
    }

    return accumulator;
  },
  []
);
