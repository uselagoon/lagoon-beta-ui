import type { Meta, StoryObj } from '@storybook/react';

import KeyFacts from './KeyFacts';

const meta: Meta<typeof KeyFacts> = {
  title: 'Components/Display/KeyFacts',
  component: KeyFacts,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof KeyFacts>;

export const Default: Story = {
  args: {
    loading: false,
    keyFacts: [
      { id: 1, name: 'PHP', category: 'Language', value: '8.2.0' },
      { id: 2, name: 'MariaDB', category: 'Service', value: '10.11' },
      { id: 3, name: 'Redis', category: 'Service', value: '7.0' },
      { id: 4, name: 'Drupal', category: 'Application', value: '10.2.0' },
    ],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const ManyFacts: Story = {
  args: {
    loading: false,
    keyFacts: [
      { id: 1, name: 'PHP', category: 'Language', value: '8.2.0' },
      { id: 2, name: 'NodeJS', category: 'Language', value: '20.10.0' },
      { id: 3, name: 'MariaDB', category: 'Service', value: '10.11' },
      { id: 4, name: 'Redis', category: 'Service', value: '7.0' },
      { id: 5, name: 'NGINX', category: 'Service', value: '1.25' },
      { id: 6, name: 'Drupal', category: 'Application', value: '10.2.0' },
      { id: 7, name: 'Alpine Linux', category: 'OS', value: '3.18' },
      { id: 8, name: 'Solr', category: 'Service', value: '9.4' },
    ],
  },
};

export const SingleFact: Story = {
  args: {
    loading: false,
    keyFacts: [{ id: 1, name: 'PHP', category: 'Language', value: '8.2.0' }],
  },
};
