export type PlanType = "Free" | "Pro" | "Enterprise";

type FeatureTierProps = {
  availability: "positive" | "negative" | "neutral";
  customtext?: string;
};

export type FeatureProps = {
  key?: string;
  defaultText: string;
} & {
  [P in PlanType]: FeatureTierProps;
};

export type PlanProps = {
    [P in PlanType]: {
        product_id: string;
        price:{
            monthly: {
                amount: number | string;
                currency: string;
                price_id: string;
            },
            annually: {
                amount: number | string;
                currency: string;
                price_id: string;
            }
        }
        tagline: string;
        meter: string;
        pricing_cta:string;
        billing_cta:string;
    }
};
