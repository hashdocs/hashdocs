export const HASHDOCS_META_TAGS = {
  title: {
    template: '%s | Hashdocs',
    default: 'Hashdocs', // a default is required when creating a template
  },
  description:
    'An open-source dataroom platform with secure document sharing, powerful link controls and realtime tracking. A better alternative to docsend.',
  icon: 'assets/hashdocs_logo_512x512.png',
  og_image: `${
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://' + process.env.VERCEL_BRANCH_URL
  }/assets/og.jpg`,
  theme_color: '#1D4ED8',
};
