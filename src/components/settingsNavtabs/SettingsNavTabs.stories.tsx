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
  children?: React.ReactNode;
}

const SettingsNavTabsDemo = ({ pathname, children }: DemoProps) => {
  return (
    <NextLinkProvider linkComponent={MockLink}>
      <section className="flex flex-col gap-4">
        <TabNavigation
          pathname={pathname}
          items={[
            {
              key: 'ssh',
              label: <MockLink href="/settings">SSH Keys</MockLink>,
            },
            {
              key: 'preferences',
              label: <MockLink href="/settings/preferences">Preferences</MockLink>,
            },
          ]}
        />
        {children || (
          <div className="p-4 border rounded-lg text-muted-foreground">Tab content goes here</div>
        )}
      </section>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof SettingsNavTabsDemo> = {
  title: 'Components/Navigation/SettingsNavTabs',
  component: SettingsNavTabsDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SettingsNavTabsDemo>;

export const SSHKeysActive: Story = {
  args: {
    pathname: '/settings',
  },
};

export const PreferencesActive: Story = {
  args: {
    pathname: '/settings/preferences',
  },
};
