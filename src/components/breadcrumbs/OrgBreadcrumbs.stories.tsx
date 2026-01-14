import React, { forwardRef } from 'react';

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb, NextLinkProvider } from '@uselagoon/ui-library';

const onNavigate = action('navigate');

const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  ({ href, children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onNavigate(href);
      onClick?.(e);
    };
    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
);

interface DemoProps {
  organizationSlug?: string;
  groupSlug?: string;
  userSlug?: string;
  projectSlug?: string;
}

const OrgBreadcrumbsDemo = ({ organizationSlug, groupSlug, userSlug, projectSlug }: DemoProps) => {
  const currentSlug = userSlug ? 'user' : groupSlug ? 'group' : projectSlug ? 'project' : undefined;
  const activeKey = userSlug || groupSlug || projectSlug || organizationSlug || 'organizations';

  const breadcrumbItems = [
    {
      key: 'organizations',
      title: <MockLink href="/organizations">Organizations</MockLink>,
    },
    ...(organizationSlug
      ? [
          {
            key: organizationSlug,
            title: <MockLink href={`/organizations/${organizationSlug}`}>{organizationSlug}</MockLink>,
            copyText: organizationSlug,
          },
        ]
      : []),
    ...(groupSlug
      ? [
          {
            key: groupSlug,
            title: (
              <MockLink href={`/organizations/${organizationSlug}/groups/${groupSlug}`}>{groupSlug}</MockLink>
            ),
            copyText: groupSlug,
          },
        ]
      : []),
    ...(userSlug
      ? [
          {
            key: userSlug,
            title: <MockLink href={`/organizations/${organizationSlug}/users/${userSlug}`}>{userSlug}</MockLink>,
            copyText: userSlug,
          },
        ]
      : []),
    ...(projectSlug
      ? [
          {
            key: projectSlug,
            title: (
              <MockLink href={`/organizations/${organizationSlug}/projects/${projectSlug}`}>{projectSlug}</MockLink>
            ),
            copyText: projectSlug,
          },
        ]
      : []),
  ];

  return (
    <NextLinkProvider linkComponent={MockLink}>
      <div className="flex justify-start items-baseline">
        <Breadcrumb activeKey={activeKey} items={breadcrumbItems} currentSlug={currentSlug} type="orgs" />
      </div>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof OrgBreadcrumbsDemo> = {
  title: 'Components/Navigation/OrgBreadcrumbs',
  component: OrgBreadcrumbsDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof OrgBreadcrumbsDemo>;

export const OrganizationsRoot: Story = {
  args: {},
};

export const OrganizationLevel: Story = {
  args: {
    organizationSlug: 'my-organization',
  },
};

export const GroupLevel: Story = {
  args: {
    organizationSlug: 'my-organization',
    groupSlug: 'developers',
  },
};

export const UserLevel: Story = {
  args: {
    organizationSlug: 'my-organization',
    userSlug: 'john.doe@example.com',
  },
};

export const ProjectLevel: Story = {
  args: {
    organizationSlug: 'my-organization',
    projectSlug: 'my-project',
  },
};
