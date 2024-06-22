/*=========================================== COMPONENT ===========================================*/

import SettingsSidebar from './_components/settingsSidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex w-full flex-1">
      <SettingsSidebar />
      <div className="flex flex-1 flex-col gap-y-2">
        {/* <PageHeader /> */}
        {children}
      </div>
    </div>
  );
}
