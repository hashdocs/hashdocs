import { PostHog } from "posthog-node";

export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
  return posthogClient;
}
