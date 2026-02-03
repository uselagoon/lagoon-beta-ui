import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ArrowLeft } from 'lucide-react';

const onNavigate = action('navigate-back');

const BackButtonDemo = () => {
  return (
    <div className="mb-5 flex cursor-pointer items-center gap-1" onClick={() => onNavigate()}>
      <ArrowLeft />
      <span className="text-base leading-[18px] underline">Back</span>
    </div>
  );
};

const meta: Meta<typeof BackButtonDemo> = {
  title: 'Components/Actions/BackButton',
  component: BackButtonDemo,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof BackButtonDemo>;

export const Default: Story = {};
