import { GrOrganization } from 'react-icons/gr';
import { MdOutlineIntegrationInstructions } from 'react-icons/md';

export type Routes =
  | 'general'
  | 'team'
  | 'billing'
  | 'api'
  | 'zapier'
  | 'webhook'
  | 'slack';

// All Settings routes
export const routes: Record<
  Routes,
  { name: string; path: string; member_access?: boolean }
> = {
  general: {
    name: 'General',
    path: '/settings/general',
  },
  team: {
    name: 'Team',
    path: '/settings/team',
  },
  billing: {
    name: 'Billing',
    path: '/settings/billing',
  },
  api: {
    name: 'API',
    path: '/settings/integrations/api',
  },
  zapier: {
    name: 'Zapier',
    path: '/settings/integrations/zapier',
  },
  webhook: {
    name: 'Webhooks',
    path: '/settings/integrations/webhooks',
  },
  slack: {
    name: 'Slack',
    path: '/settings/integrations/slack',
  },
};

// Settings navigation routes
export const secondary_navigation = [
  {
    name: 'Organization',
    icon: GrOrganization,
    routes: [
      routes.general,
      routes.team,
      routes.billing
    ],
  },
  {
    name: 'Integrations',
    icon: MdOutlineIntegrationInstructions,
    routes: [
      routes.api,
      routes.webhook,
      routes.zapier,
      routes.slack,
    ],
  },
//   {
//     name: 'Plans and Usage',
//     icon: GrOrganization,
//     routes: [routes.plans],
//   },
];
