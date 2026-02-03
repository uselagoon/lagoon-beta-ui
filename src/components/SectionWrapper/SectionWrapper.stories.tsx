import type { Meta, StoryObj } from '@storybook/react';

import SectionWrapper from './SectionWrapper';

const meta: Meta<typeof SectionWrapper> = {
  title: 'Components/Display/SectionWrapper',
  component: SectionWrapper,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SectionWrapper>;

export const Default: Story = {
  args: {
    children: <div className="text-muted-foreground">Section content goes here</div>,
  },
};

export const WithForm: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">Form Section</h3>
        <p className="text-muted-foreground text-sm">This is a form section with multiple elements</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Save</button>
          <button className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    ),
  },
};

export const WithTable: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Data Section</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Item 1</td>
              <td className="py-2">Value 1</td>
            </tr>
            <tr>
              <td className="py-2">Item 2</td>
              <td className="py-2">Value 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
};
