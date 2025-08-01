/**
 * Project navigation layout wrapping project tabs.
 */
import { ProjectBreadcrumbs } from '@/components/breadcrumbs/ProjectBreadcrumbs';
import ProjectNavTabs from '@/components/projectNavTabs/ProjectNavTabs';

export default async function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProjectBreadcrumbs />
      <ProjectNavTabs>{children}</ProjectNavTabs>
    </>
  );
}
