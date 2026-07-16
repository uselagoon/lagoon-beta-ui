import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { ReactNode } from 'react';

type Option = { label: string; value: string | number; icon?: ReactNode };
type OptionGroup = { label: string; options: Option[]; icon?: ReactNode };

export type SelectProps = Omit<React.ComponentProps<typeof Select>, 'disabled'> & {
	placeholder: string;
	options?: Option[] | OptionGroup[];
	disabled?: boolean;
	width?: number;
};

function isOptionGroupArray(options: Option[] | OptionGroup[] | undefined): options is OptionGroup[] {
	return Array.isArray(options) && options.length > 0 && 'options' in options[0]!;
}

export default function SelectWithOptions({ placeholder, options, disabled, width, ...rest }: SelectProps) {
	return (
		<Select disabled={disabled} {...rest}>
			<SelectTrigger className={`w-[${width ?? '266px'}]`}>
				<SelectValue placeholder={placeholder || 'Make a selection'} />
			</SelectTrigger>
			{!disabled &&
				options &&
				Array.isArray(options) &&
				(options.length > 0 ? (
					<SelectContent>
						{isOptionGroupArray(options)
							? options.map((group) => (
									<SelectGroup key={group.label}>
										<SelectLabel>{group.label}</SelectLabel>
										{group.options.map((option) => (
											<SelectItem key={option.value} value={String(option.value)}>
												<div className="flex items-center gap-2">
													{option.icon && <span className="flex-shrink-0">{option.icon}</span>}
													<span>{option.label}</span>
												</div>
											</SelectItem>
										))}
									</SelectGroup>
								))
							: options.map((option) => (
									<SelectItem key={option.value} value={String(option.value)}>
										<div className="flex items-center gap-2">
											{option.icon && <span className="flex-shrink-0">{option.icon}</span>}
											<span>{option.label}</span>
										</div>
									</SelectItem>
								))}
					</SelectContent>
				) : (
					<SelectContent className="text-center text-muted-foreground">No options</SelectContent>
				))}
		</Select>
	);
}
