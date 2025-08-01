'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Breadcrumb, Input } from '@uselagoon/ui-library';

export const ProjectBreadcrumbs = () => {
  const { projectSlug, environmentSlug } = useParams<{ projectSlug: string; environmentSlug: string }>();

  const activeKey = environmentSlug || projectSlug || 'projects';
  const breadcrumbItems = [
    {
      key: 'projects',
      title: <Link href="/projects">Projects</Link>,
    },
    ...(projectSlug
      ? [
          {
            key: projectSlug,
            title: <Link href={`/projects/${projectSlug}`}>{projectSlug}</Link>,
            copyText: projectSlug,
          },
        ]
      : []),

    ...(environmentSlug
      ? [
          {
            key: environmentSlug,
            title: <Link href={`/projects/${projectSlug}/${environmentSlug}`}>{environmentSlug}</Link>,
            copyText: environmentSlug,
          },
        ]
      : []),
  ];

  return (
    <div className="flex justify-between items-baseline">
      <Breadcrumb activeKey={activeKey} items={breadcrumbItems} type="default" />
      <Input className="-translate-y-6" placeholder="Search" label="" />
    </div>
  );
};
