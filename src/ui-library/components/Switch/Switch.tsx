import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Loader2 } from 'lucide-react';

type SwitchProps = React.ComponentProps<typeof Switch> & {
	label: string;
	description: string;
	id: string;
	loading?: boolean;
};

export default function SwitchWithDescription({ id, label, description, disabled, loading, ...rest }: SwitchProps) {
	return (
		<div className="flex space-x-2">
			<Switch id={id} disabled={disabled || loading} {...rest} />
			<div className="space-y-2">
				<Label className={`pt-[3px] ${loading ? 'opacity-60' : ''}`} htmlFor={id}>
					{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : label}
				</Label>
				<span className={`text-[#737373] ${loading ? 'opacity-60' : ''}`}>{description}</span>
			</div>
		</div>
	);
}
