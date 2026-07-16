import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { default as BreadCrumb } from '../components/Breadcrumb';
import { Controls, Primary, Stories, Story, Title } from '@storybook/addon-docs/blocks';

const meta: Meta<typeof BreadCrumb> = {
	component: BreadCrumb,
	title: 'ui-library/BreadCrumb',
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<>
					<Title />
					<p>
						A breadcrumb displays the current location within a hierarchy. It allows going back higher up in the
						hierarchy.
					</p>
					<Primary />
					<Controls />

					<h2>Items</h2>
					<p>
						The <code>items</code> prop is an array that defines the breadcrumb items. Each item can be an object with a
						'title' property and optional 'navOnClick' and 'key' properties.
					</p>
					<Stories />
				</>
			),
		},
		design: {
			type: 'figspec',
			url: 'https://www.figma.com/file/iRRQQSnRmqdcoiysogtjO7/Dashboard?type=design&node-id=0-13288&mode=design&t=P00gx6yjJRZgHUuj-4',
		},
	},
};

type Story = StoryObj<typeof BreadCrumb>;

const items = [
	{
		title: 'Home',
	},
	{
		title: 'Projects',
		navOnClick: () => {
			console.log('nav should be handled here');
		},
	},
	{
		title: 'as-demo',
	},
	{
		title: 'master',
		key: 'activeItem',
		navOnClick: () => {
			console.log('nav should be handled here');
		},
	},
];

const LinkItems = [
	{
		title: <a href="#">Projects</a>,
	},
	{
		title: <a href="#">as-demo</a>,
		copyText: 'as-demo',
	},
	{
		title: <a href="#">Environment</a>,
		key: 'activeItem',
		copyText: 'Environment',
	},
];

const OrgLinkitems = [
	{
		title: <a href="#">Organizations</a>,
	},
	{
		title: <a href="#">Some organization</a>,
		copyText: 'Some organization',
	},
	{
		title: <a href="#">as-demo</a>,
		key: 'activeItem',
		copyText: 'as-demo',
	},
];

export const DefaultEnvsWithActiveLinks: Story = {
	args: {
		items: LinkItems,
		activeKey: 'activeItem',
		type: 'default',
	},
};
export const DefaultOrgsWithActiveLinks: Story = {
	args: {
		items: OrgLinkitems,
		activeKey: 'activeItem',
		type: 'orgs',
	},
};
export const ItemsWithClickHandlers: Story = {
	args: {
		items: items,
		activeKey: 'activeItem',
	},
};

export const PrependedSeparator: Story = {
	args: {
		items: items,
		activeKey: 'activeItem',
	},
};

export default meta;
