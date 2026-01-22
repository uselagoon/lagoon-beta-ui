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

const SettingsBreadcrumbsDemo = () => {
  const breadcrumbItems = [
    {
      key: 'settings',
      title: <MockLink href="/settings">Settings</MockLink>,
    },
  ];

  return (
    <NextLinkProvider linkComponent={MockLink}>
      <div className="flex justify-start items-baseline">
        <Breadcrumb activeKey="settings" items={breadcrumbItems} type="orgs" />
      </div>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof SettingsBreadcrumbsDemo> = {
  title: 'Components/Navigation/SettingsBreadcrumbs',
  component: SettingsBreadcrumbsDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SettingsBreadcrumbsDemo>;

export const Default: Story = {};
