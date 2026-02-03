import type { Meta, StoryObj } from '@storybook/react';

import FactCard from './FactCard';

const meta: Meta<typeof FactCard> = {
  title: 'Components/Display/FactCard',
  component: FactCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FactCard>;

export const PHP: Story = {
  args: {
    id: 1,
    name: 'PHP',
    category: 'Language',
    value: '8.2.0',
  },
};

export const NodeJS: Story = {
  args: {
    id: 2,
    name: 'NodeJS',
    category: 'Language',
    value: '20.10.0',
  },
};

export const MariaDB: Story = {
  args: {
    id: 3,
    name: 'MariaDB',
    category: 'Service',
    value: '10.11',
  },
};

export const Drupal: Story = {
  args: {
    id: 4,
    name: 'Drupal',
    category: 'Application',
    value: '10.2.0',
  },
};

export const AlpineLinux: Story = {
  args: {
    id: 5,
    name: 'Alpine Linux',
    category: 'OS',
    value: '3.18',
  },
};

export const Redis: Story = {
  args: {
    id: 6,
    name: 'Redis',
    category: 'Service',
    value: '7.0',
  },
};
