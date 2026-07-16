import {Button} from '@ui-lib/components/ui/button'

interface ActionButtonProps {
	selected: boolean;
	onSelect: () => void;
	icon: React.ReactNode;
	title: string;
	description: string;
	disabled?: boolean;
	type?: string
}

export default function ActionButton({
 selected,
 onSelect,
 icon,
 title,
 description,
 disabled,
 type
}:ActionButtonProps) {
	return (
		<Button
			key={type}
			variant={selected ? 'default' : 'secondary'}
			onClick={onSelect}
			disabled={disabled}
			className={`flex-1 flex h-auto items-start gap-3 p-4 rounded-lg border text-left transition-all`}
		>
			<div className="flex gap-3">
				<div className={`mt-0.5 flex-shrink-0 ${selected ? 'text-blue-500' : 'text-gray-400'}`}>{icon}</div>
				<div className="flex flex-col gap-1">
					<span className="font-medium text-sm">{title}</span>
					<span className="text-xs opacity-70 font-normal">{description}</span>
				</div>
			</div>
		</Button>
		)

}