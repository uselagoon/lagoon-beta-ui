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
  bulkId: string;
}

const BulkDeploymentsBreadcrumbsDemo = ({ bulkId }: DemoProps) => {
  const breadcrumbItems = [
    {
      key: 'bulkdeployment',
      title: <MockLink href={`/bulkdeployment/${bulkId}`}>Bulk Deployment</MockLink>,
    },
  ];

  return (
    <NextLinkProvider linkComponent={MockLink}>
      <div className="flex justify-start items-baseline">
        <Breadcrumb activeKey="bulkdeployment" items={breadcrumbItems} type="orgs" />
      </div>
    </NextLinkProvider>
  );
};

const meta: Meta<typeof BulkDeploymentsBreadcrumbsDemo> = {
  title: 'Components/Navigation/BulkDeploymentsBreadcrumbs',
  component: BulkDeploymentsBreadcrumbsDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof BulkDeploymentsBreadcrumbsDemo>;

export const Default: Story = {
  args: {
    bulkId: 'bulk-123',
  },
};
