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
  projectSlug?: string;
  environmentSlug?: string;
}

const ProjectBreadcrumbsDemo = ({ projectSlug, environmentSlug }: DemoProps) => {
  const activeKey = environmentSlug || projectSlug || 'projects';
  const breadcrumbItems = [
    {
      key: 'projects',
      title: <MockLink href="/projects">Projects</MockLink>,
    },
    ...(projectSlug
      ? [
          {
            key: projectSlug,
            title: <MockLink href={`/projects/${projectSlug}`}>{projectSlug}</MockLink>,
            copyText: projectSlug,
          },
        ]
      : []),

    ...(environmentSlug
      ? [
          {
            key: environmentSlug,
            title: <MockLink href={`/projects/${projectSlug}/${environmentSlug}`}>{environmentSlug}</MockLink>,
            copyText: environmentSlug,
          },
        ]
      : []),
  ];

  return (
    <NextLinkProvider linkComponent={MockLink}>
      <div className="flex justify-start items-baseline">
        <Breadcrumb activeKey={activeKey} items={breadcrumbItems} type="default" />
      </div>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof ProjectBreadcrumbsDemo> = {
  title: 'Components/Navigation/ProjectBreadcrumbs',
  component: ProjectBreadcrumbsDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ProjectBreadcrumbsDemo>;

export const ProjectsRoot: Story = {
  args: {},
};

export const ProjectLevel: Story = {
  args: {
    projectSlug: 'my-project',
  },
};

export const EnvironmentLevel: Story = {
  args: {
    projectSlug: 'my-project',
    environmentSlug: 'my-project-main',
  },
};
