import React, { forwardRef } from 'react';

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { NextLinkProvider, TabNavigation } from '@uselagoon/ui-library';

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
  pathname: string;
  organizationSlug: string;
  showVariablesTab?: boolean;
  children?: React.ReactNode;
}

const OrgNavTabsDemo = ({ pathname, organizationSlug, showVariablesTab = true, children }: DemoProps) => {
  return (
    <NextLinkProvider linkComponent={MockLink}>
      <section className="flex flex-col gap-4">
        <TabNavigation
          pathname={pathname}
          items={[
            {
              key: 'overview',
              label: <MockLink href={`/organizations/${organizationSlug}`}>Overview</MockLink>,
            },
            {
              key: 'groups',
              label: <MockLink href={`/organizations/${organizationSlug}/groups`}>Groups</MockLink>,
            },
            {
              key: 'users',
              label: <MockLink href={`/organizations/${organizationSlug}/users`}>Users</MockLink>,
            },
            {
              key: 'projects',
              label: <MockLink href={`/organizations/${organizationSlug}/projects`}>Projects</MockLink>,
            },
            ...(showVariablesTab
              ? [
                  {
                    key: 'variables',
                    label: <MockLink href={`/organizations/${organizationSlug}/variables`}>Variables</MockLink>,
                  },
                ]
              : []),
            {
              key: 'notifications',
              label: <MockLink href={`/organizations/${organizationSlug}/notifications`}>Notifications</MockLink>,
            },
            {
              key: 'manage',
              label: <MockLink href={`/organizations/${organizationSlug}/manage`}>Administration</MockLink>,
            },
          ]}
        />
        {children || <div className="p-4 border rounded-lg text-muted-foreground">Tab content goes here</div>}
      </section>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof OrgNavTabsDemo> = {
  title: 'Components/Navigation/OrgNavTabs',
  component: OrgNavTabsDemo,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showVariablesTab: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof OrgNavTabsDemo>;

export const Overview: Story = {
  args: {
    pathname: '/organizations/my-org',
    organizationSlug: 'my-org',
  },
};

export const Groups: Story = {
  args: {
    pathname: '/organizations/my-org/groups',
    organizationSlug: 'my-org',
  },
};

export const Users: Story = {
  args: {
    pathname: '/organizations/my-org/users',
    organizationSlug: 'my-org',
  },
};

export const Administration: Story = {
  args: {
    pathname: '/organizations/my-org/manage',
    organizationSlug: 'my-org',
  },
};

export const WithoutVariables: Story = {
  args: {
    pathname: '/organizations/my-org',
    organizationSlug: 'my-org',
    showVariablesTab: false,
  },
};
