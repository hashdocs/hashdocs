import { FeatureProps, PlanProps, PlanType } from "@/types/billing.types";

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
    product_id: "",
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
    product_id: "",
    price: {
      monthly: {
        amount: 15,
        currency: "$",
        price_id: "",
      },
      annually: {
        amount: 150,
        currency: "$",
        price_id: "",
      },
    },
    tagline: "For startups and small teams",
    meter: "per user per month",
    pricing_cta: "Get started",
    billing_cta: "Upgrade to Pro",
  },
  Enterprise: {
    product_id: "",
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
