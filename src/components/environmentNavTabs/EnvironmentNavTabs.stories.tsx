import React, { forwardRef } from 'react';

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge, NextLinkProvider, TabNavigation } from '@uselagoon/ui-library';

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
  environmentSlug: string;
  showProblemsTab?: boolean;
  showFactsTab?: boolean;
  problemsCount?: number;
  children?: React.ReactNode;
}

const EnvironmentNavTabsDemo = ({
  pathname,
  projectSlug,
  environmentSlug,
  showProblemsTab = true,
  showFactsTab = true,
  problemsCount = 3,
  children,
}: DemoProps) => {
  return (
    <NextLinkProvider linkComponent={MockLink}>
      <section className="flex flex-col gap-4">
        <TabNavigation
          pathname={pathname}
          items={[
            {
              key: 'overview',
              label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}`}>Overview</MockLink>,
            },
            {
              key: 'deployments',
              label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}/deployments`}>Deployments</MockLink>,
            },
            {
              key: 'backups',
              label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}/backups`}>Backups</MockLink>,
            },
            {
              key: 'tasks',
              label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}/tasks`}>Tasks</MockLink>,
            },
            {
              key: 'routes',
              label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}/routes`}>Routes</MockLink>,
            },
            ...(showProblemsTab
              ? [
                  {
                    key: 'problems',
                    label: (
                      <MockLink href={`/projects/${projectSlug}/${environmentSlug}/problems`}>
                        <div className="inline-flex gap-1">
                          Problems
                          <Badge className="rounded-full" variant="default">
                            {problemsCount}
                          </Badge>
                        </div>
                      </MockLink>
                    ),
                  },
                ]
              : []),
            ...(showFactsTab
              ? [
                  {
                    key: 'insights',
                    label: <MockLink href={`/projects/${projectSlug}/${environmentSlug}/insights`}>Insights</MockLink>,
                  },
                ]
              : []),
            {
              key: 'environment-variables',
              label: (
                <MockLink href={`/projects/${projectSlug}/${environmentSlug}/environment-variables`}>
                  Variables
                </MockLink>
              ),
            },
          ]}
        />
        {children || <div className="p-4 border rounded-lg text-muted-foreground">Tab content goes here</div>}
      </section>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof EnvironmentNavTabsDemo> = {
  title: 'Components/Navigation/EnvironmentNavTabs',
  component: EnvironmentNavTabsDemo,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showProblemsTab: { control: 'boolean' },
    showFactsTab: { control: 'boolean' },
    problemsCount: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof EnvironmentNavTabsDemo>;

export const Overview: Story = {
  args: {
    pathname: '/projects/my-project/my-project-main',
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
  },
};

export const Deployments: Story = {
  args: {
    pathname: '/projects/my-project/my-project-main/deployments',
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
  },
};

export const WithManyProblems: Story = {
  args: {
    pathname: '/projects/my-project/my-project-main/problems',
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
    problemsCount: 42,
  },
};

export const NoProblemsTab: Story = {
  args: {
    pathname: '/projects/my-project/my-project-main',
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
    showProblemsTab: false,
  },
};

export const MinimalTabs: Story = {
  args: {
    pathname: '/projects/my-project/my-project-main',
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
    showProblemsTab: false,
    showFactsTab: false,
  },
};
