import type { Meta, StoryObj } from '@storybook/react';
import ChangeFeedContainer from '../components/ChangeFeed';
import { sampleActivityData } from '../components/ChangeFeed/sampleData';

const meta: Meta<typeof ChangeFeedContainer> = {
    component: ChangeFeedContainer,
    title: 'ui-library/ChangeFeed',
    tags: ['autodocs'],
};

type Story = StoryObj<typeof ChangeFeedContainer>;

export const Default: Story = {
    args: {
        sourceData: 'http://invalid-url-for-test.com/feed.json',
        fallbackData: sampleActivityData,
    },
};

export const Empty: Story = {
    args: {
        sourceData: 'http://invalid-url-for-test.com/feed.json',
        fallbackData: [],
    },
};

export const SingleItem: Story = {
    args: {
        sourceData: 'http://invalid-url-for-test.com/feed.json',
        fallbackData: [sampleActivityData[0]],
    },
};

export const NoTags: Story = {
    args: {
        sourceData: 'http://invalid-url-for-test.com/feed.json',
        fallbackData: sampleActivityData.map(item => ({ ...item, tags: undefined })),
    },
};

export const NoDescription: Story = {
    args: {
        sourceData: 'http://invalid-url-for-test.com/feed.json',
        fallbackData: sampleActivityData.map(item => ({ ...item, description: '' })),
    },
};

export default meta;


