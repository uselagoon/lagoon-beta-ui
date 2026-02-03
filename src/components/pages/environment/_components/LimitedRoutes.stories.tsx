import type { Meta, StoryObj } from '@storybook/react';

import LimitedRoutes from './LimitedRoutes';

const generateRouteLinks = (count: number) => {
  return Array.from({ length: count }, (_, i) => (
    <a key={i} href={`https://route-${i + 1}.example.com`} target="_blank" rel="noopener noreferrer">
      https://route-{i + 1}.example.com
    </a>
  ));
};

const meta: Meta<typeof LimitedRoutes> = {
  title: 'Components/Display/LimitedRoutes',
  component: LimitedRoutes,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof LimitedRoutes>;

export const FewRoutes: Story = {
  args: {
    routes: generateRouteLinks(3),
  },
};

export const ExactlyFive: Story = {
  args: {
    routes: generateRouteLinks(5),
  },
};

export const ManyRoutes: Story = {
  args: {
    routes: generateRouteLinks(10),
  },
};

export const SingleRoute: Story = {
  args: {
    routes: [
      <a key="main" href="https://www.example.com" target="_blank" rel="noopener noreferrer">
        https://www.example.com
      </a>,
    ],
  },
};

export const MixedRoutes: Story = {
  args: {
    routes: [
      <a key="1" href="https://www.example.com" target="_blank" rel="noopener noreferrer">
        https://www.example.com
      </a>,
      <a key="2" href="https://api.example.com" target="_blank" rel="noopener noreferrer">
        https://api.example.com
      </a>,
      <a key="3" href="https://admin.example.com" target="_blank" rel="noopener noreferrer">
        https://admin.example.com
      </a>,
      <a key="4" href="https://staging.example.com" target="_blank" rel="noopener noreferrer">
        https://staging.example.com
      </a>,
      <a key="5" href="https://preview.example.com" target="_blank" rel="noopener noreferrer">
        https://preview.example.com
      </a>,
      <a key="6" href="https://cdn.example.com" target="_blank" rel="noopener noreferrer">
        https://cdn.example.com
      </a>,
      <a key="7" href="https://media.example.com" target="_blank" rel="noopener noreferrer">
        https://media.example.com
      </a>,
    ],
  },
};
