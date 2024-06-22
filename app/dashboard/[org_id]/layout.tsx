import { OrgProvider } from './_provider/useOrg';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OrgProvider>{children}</OrgProvider>;
}
