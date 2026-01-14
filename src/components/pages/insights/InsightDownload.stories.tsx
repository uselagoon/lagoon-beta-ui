import type { Meta, StoryObj } from '@storybook/react';

import { InsightDownload } from './InsightDownload';

const meta: Meta<typeof InsightDownload> = {
  title: 'Components/Actions/InsightDownload',
  component: InsightDownload,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InsightDownload>;

export const Default: Story = {
  args: {
    insight: {
      id: 1,
      type: 'sbom',
      service: 'cli',
      created: '2024-01-15T10:00:00Z',
      file: 'sbom.json',
      fileId: 'file-123',
      size: 1024,
    } as any,
    environmentId: 1,
  },
};

export const ImageInsight: Story = {
  args: {
    insight: {
      id: 2,
      type: 'image',
      service: 'nginx',
      created: '2024-01-15T10:00:00Z',
      file: 'image-scan.json',
      fileId: 'file-456',
      size: 2048,
    } as any,
    environmentId: 1,
  },
};
