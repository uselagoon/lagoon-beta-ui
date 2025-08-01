/**
 * Project navigation layout wrapping settings tabs.
 */
import { SettingsBreadcrumbs } from '@/components/breadcrumbs/SettingsBreadcrumbs';
import SettingsNavTabs from '@/components/settingsNavtabs/SettingsNavTabs';

export default async function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SettingsBreadcrumbs />
      <SettingsNavTabs>{children}</SettingsNavTabs>
    </>
  );
}
