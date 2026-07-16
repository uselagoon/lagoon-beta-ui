import { Label } from '@ui-lib/components/ui/label';
import { Input as ShadInput } from '@ui-lib/components/ui/input';
import React, { ComponentProps, forwardRef, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

type InputProps = ComponentProps<typeof ShadInput> & {
	label?: string;
	placeholder?: string;
	description?: string;
	icon?: ReactNode;
};
const inputVariants = cva('w-full rounded-lg bg-background', {
	variants: {
		hasIcon: {
			true: 'pl-8',
			false: '',
		},
	},
});

export default function Input({ label = '', placeholder = '', icon, description, ...rest }: InputProps) {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor={`${label}-input`}>{label}</Label>
			<div className="relative">
				{icon && <div className="absolute left-2.5 top-1.5 h-2.5 w-2.5 text-muted-foreground">{icon}</div>}
				<ShadInput
					className={inputVariants({ hasIcon: !!icon })}
					id={`${label}-input`}
					placeholder={placeholder}
					{...rest}
				/>
				{description && (
					<p className="font-sans font-normal text-sm leading-[1.5] tracking-[0%] text-muted-foreground">
						{description}
					</p>
				)}
			</div>
		</div>
	);
}

type DebouncedInputProps = {
	value: string;
	onChange: (value: string) => void;
	debounce?: number;
	label: string;
	placeholder?: string;
	description?: string;
	icon?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
	({ value: initialValue, onChange, debounce = 500, label, placeholder = '', icon, description, ...rest }, ref) => {
		const [value, setValue] = React.useState(initialValue);
		const [loading, setLoading] = React.useState(false);

		React.useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		React.useEffect(() => {
			setLoading(true);
			const timeout = setTimeout(() => {
				onChange(String(value));
				setLoading(false);
			}, debounce);

			return () => clearTimeout(timeout);
		}, [value]);

		return (
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor={`${label}-input`}>{label}</Label>
				<div className="relative">
					{icon && <div className="absolute left-2.5 top-1.5 h-2.5 w-2.5 text-muted-foreground">{icon}</div>}
					{loading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
					<ShadInput
						{...rest}
						ref={ref}
						className={inputVariants({ hasIcon: !!icon })}
						id={`${label}-input`}
						placeholder={placeholder}
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					{description && (
						<p className="font-sans font-normal text-sm leading-[1.5] tracking-[0%] text-muted-foreground">
							{description}
						</p>
					)}
				</div>
			</div>
		);
	},
);
