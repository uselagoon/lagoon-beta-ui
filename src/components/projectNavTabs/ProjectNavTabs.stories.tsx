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
  projectSlug: string;
  showDeployTargets?: boolean;
  children?: React.ReactNode;
}

const ProjectNavTabsDemo = ({ pathname, projectSlug, showDeployTargets = true, children }: DemoProps) => {
  return (
    <NextLinkProvider linkComponent={MockLink}>
      <section className="flex flex-col gap-4">
        <TabNavigation
          pathname={pathname}
          items={[
            {
              key: 'environments',
              label: <MockLink href={`/projects/${projectSlug}`}>Environments</MockLink>,
            },
            {
              key: 'project-details',
              label: <MockLink href={`/projects/${projectSlug}/project-details`}>Details</MockLink>,
            },
            {
              key: 'project-variables',
              label: <MockLink href={`/projects/${projectSlug}/project-variables`}>Variables</MockLink>,
            },
            {
              key: 'routes',
              label: <MockLink href={`/projects/${projectSlug}/routes`}>Routes</MockLink>,
            },
            ...(showDeployTargets
              ? [
                  {
                    key: 'deploy-targets',
                    label: <MockLink href={`/projects/${projectSlug}/deploy-targets`}>Deploy Targets</MockLink>,
                  },
                ]
              : []),
          ]}
        />
        {children || <div className="p-4 border rounded-lg text-muted-foreground">Tab content goes here</div>}
      </section>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof ProjectNavTabsDemo> = {
  title: 'Components/Navigation/ProjectNavTabs',
  component: ProjectNavTabsDemo,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showDeployTargets: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectNavTabsDemo>;

export const Environments: Story = {
  args: {
    pathname: '/projects/my-project',
    projectSlug: 'my-project',
  },
};

export const Details: Story = {
  args: {
    pathname: '/projects/my-project/project-details',
    projectSlug: 'my-project',
  },
};

export const Variables: Story = {
  args: {
    pathname: '/projects/my-project/project-variables',
    projectSlug: 'my-project',
  },
};

export const Routes: Story = {
  args: {
    pathname: '/projects/my-project/routes',
    projectSlug: 'my-project',
  },
};

export const WithoutDeployTargets: Story = {
  args: {
    pathname: '/projects/my-project',
    projectSlug: 'my-project',
    showDeployTargets: false,
  },
};
