import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import MaintenanceBanner, { BannerItem, StatusMapper } from './MaintenanceBanner';
import { mockBannerItems } from './maintenanceBanner.mock';

// the component always fetches before mapping, a data URL keeps that off the network
const OFFLINE_ENDPOINT = 'data:application/json,{}';

const mapTo = (items: BannerItem[]): StatusMapper => () => items;

const inProgress = mockBannerItems.filter(item => item.type === 'Maintenance' && item.status === 'in_progress');
const scheduled = mockBannerItems.filter(item => item.type === 'Maintenance' && item.startsIn != null);

const meta: Meta<typeof MaintenanceBanner> = {
  title: 'Components/MaintenanceBanner',
  component: MaintenanceBanner,
  parameters: {
    layout: 'padded',
  },
  args: {
    endpoint: OFFLINE_ENDPOINT,
    mapper: mapTo(mockBannerItems),
  },
  decorators: [
    Story => (
      <div className="flex h-10 items-center justify-end">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MaintenanceBanner>;

export const Mixed: Story = {};

export const InProgressOnly: Story = {
  args: { mapper: mapTo(inProgress) },
};

export const ScheduledOnly: Story = {
  args: { mapper: mapTo(scheduled) },
};

export const Empty: Story = {
  args: { mapper: mapTo([]) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('All systems operational')).toBeInTheDocument();
  },
};

export const PopoverOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: /Notifications\s*3/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('3 active')).toBeInTheDocument();
  },
};

export const SheetOpen: Story = {
  play: async context => {
    await PopoverOpen.play?.(context);
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('button', { name: /Unplanned Database Outage/ }));
    const sheet = await body.findByRole('dialog', { name: 'Unplanned Database Outage' });
    await expect(within(sheet).getByRole('link', { name: 'Open on status page' })).toHaveAttribute(
      'href',
      mockBannerItems[0].shortlink
    );
  },
};
