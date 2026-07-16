import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

type CheckboxProps = React.ComponentProps<typeof Checkbox> & {
	label: string;
	id: string;
};

export default function CheckboxWithLabel({ label, id, ...rest }: CheckboxProps) {
	return (
		<>
			<div className="flex items-center gap-3">
				<Checkbox id={id} {...rest} />
				<Label htmlFor={id}>{label}</Label>
			</div>
		</>
	);
}

CheckboxWithLabel.displayName = 'CheckboxWithLabel';
