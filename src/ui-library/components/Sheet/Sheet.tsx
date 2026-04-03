import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '../ui/label';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTrigger,
	SheetFooter,
	SheetTitle,
	SheetHeader,
	SheetClose,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Checkbox from '../Checkbox';
import SelectWithOptions from '../Select';
import { SelectProps } from '../Select/Select';
import { Loader2 } from 'lucide-react';

type SheetProps = React.ComponentProps<typeof Sheet> & {
	sheetTitle?: ReactNode;
	sheetTrigger?: ReactNode;
	sheetDescription?: string;
	sheetFooterButton?: string;
	loading?: boolean;
	disabled?: boolean;
	buttonAction?: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		values: any,
	) => Promise<boolean | void> | boolean | void;
	additionalContent: ReactNode;
	error: boolean;
	sheetFields: {
		id: string;
		label: string;
		inputDefault?: string | boolean;
		type?: string;
		placeholder?: string;
		required?: boolean;
		options?: SelectProps['options'];
		readOnly?: boolean;
		triggerFieldUpdate?: boolean;
		validate?: (value: string | boolean) => string | null;
	}[];
	onFieldChange?: (fieldId: string, value: string | boolean, currentValues: Record<string, string | boolean>) => void;
};

export default function UISheet({
	sheetTrigger = 'Open',
	sheetTitle = '',
	sheetDescription = '',
	sheetFooterButton = 'Save changes',
	buttonAction = () => {},
	sheetFields,
	loading = false,
	disabled = false,
	additionalContent = null,
	error = false,
	onFieldChange,
	...rest
}: SheetProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const prevLoadingRef = useRef(loading);

	const getInitialFieldValues = useMemo(() => {
		return () => {
			const initialValues: Record<string, string | boolean> = {};
			sheetFields.forEach((field) => {
				if (field.inputDefault !== undefined) {
					initialValues[field.id] = field.inputDefault;
				}
			});
			return initialValues;
		};
	}, [sheetFields]);

	const [fieldValues, setFieldValues] = useState<Record<string, string | boolean>>(getInitialFieldValues);

	const validateAllFields = (values: Record<string, string | boolean>) => {
		const errors: Record<string, string> = {};

		sheetFields.forEach((field) => {
			if (field.validate) {
				const error = field.validate(values[field.id]);
				if (error) errors[field.id] = error;
			}
		});

		return errors;
	};

	const buttonDisabled = useMemo(() => {
		const requiredFieldsNotFilled = sheetFields.some((field) => {
			if (field.required) {
				switch (field.type ?? 'text') {
					case 'checkbox':
						return fieldValues[field.id] !== true;
					case 'select':
					case 'textarea':
					case 'text':
					case 'email':
					case 'number':
					case 'password':
					case 'tel':
						return !fieldValues[field.id];
					default:
						return false;
				}
			}
			return false;
		});

		return requiredFieldsNotFilled || loading;
	}, [sheetFields, fieldValues, loading]);

	const handleInputChange = (id: string, value: string | boolean) => {
		const newValues = {
			...fieldValues,
			[id]: value,
		};

		setFieldValues(newValues);

		const changedField = sheetFields.find((field) => field.id === id);

		if (changedField?.triggerFieldUpdate && onFieldChange) {
			onFieldChange(id, value, newValues);
		}
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (buttonDisabled) return;

		const allErrors = validateAllFields(fieldValues);
		setFieldErrors(allErrors);
		if (Object.keys(allErrors).length > 0) return;

		try {
			const result = await buttonAction(e, fieldValues);
			// if loading was never passed/default false, then close
			if (result !== false && !loading && !error) {
				setTimeout(() => setSheetOpen(false));
			}
		} catch (err) {
			console.error('Error in button action:', err);
		}
	};

	useEffect(() => {
		if (sheetOpen) {
			setFieldValues(getInitialFieldValues());
			setFieldErrors({});
		}
	}, [sheetOpen, getInitialFieldValues]);

	useEffect(() => {
		if (prevLoadingRef.current === true && loading === false && sheetOpen && !error) {
			setSheetOpen(false);
		}
		prevLoadingRef.current = loading;
	}, [loading, sheetOpen, error]);

	useEffect(() => {
		const currentFieldIds = sheetFields.map((field) => field.id);
		const currentValueIds = Object.keys(fieldValues);

		const updatedValues = { ...fieldValues };
		currentValueIds.forEach((id) => {
			if (!currentFieldIds.includes(id)) {
				delete updatedValues[id];
			}
		});

		sheetFields.forEach((field) => {
			if (field.inputDefault !== undefined && !(field.id in updatedValues)) {
				updatedValues[field.id] = field.inputDefault;
			}
		});

		setFieldValues(updatedValues);
		setFieldErrors((prev) => {
			const newErrors = { ...prev };
			Object.keys(newErrors).forEach((id) => {
				if (!currentFieldIds.includes(id)) {
					delete newErrors[id];
				}
			});
			return newErrors;
		});
	}, [sheetFields]);

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen} {...rest}>
			<SheetTrigger asChild>
				<Button disabled={disabled}>{sheetTrigger}</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col h-full">
				<SheetHeader>
					<SheetTitle>{sheetTitle}</SheetTitle>
					<SheetDescription>{sheetDescription}</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-4 overflow-y-auto">
					{sheetFields.map((field) => (
						<div className="grid auto-rows-min gap-6 px-4" key={field.id}>
							<div className="grid gap-3">
								{field.type !== 'checkbox' && (
									<Label htmlFor={field.id}>
										{field.label}
										{field.required && <span className="text-red-500 ml-1">*</span>}
									</Label>
								)}

								{(() => {
									switch (field.type) {
										case 'checkbox':
											return (
												<div className="flex items-center space-x-2">
													<Checkbox
														label={field.label}
														id={field.id}
														checked={fieldValues[field.id] === true || fieldValues[field.id] === 'true'}
														onCheckedChange={(checked) => handleInputChange(field.id, checked)}
													/>
												</div>
											);
										case 'textarea':
											return (
												<textarea
													id={field.id}
													className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													value={(fieldValues[field.id] as string) || ''}
													onChange={(e) => handleInputChange(field.id, e.target.value)}
													placeholder={field?.placeholder}
													readOnly={field.readOnly}
												/>
											);
										case 'select':
											return (
												<SelectWithOptions
													placeholder={field?.placeholder || ''}
													options={field?.options || []}
													value={(fieldValues[field.id] as string) || ''}
													onValueChange={(val: any) => handleInputChange(field.id, val)}
												/>
											);
										default:
											return (
												<Input
													type={field?.type || 'text'}
													id={field.id}
													value={(fieldValues[field.id] as string) || ''}
													onChange={(e) => handleInputChange(field.id, e.target.value)}
													placeholder={field?.placeholder}
													readOnly={field.readOnly}
												/>
											);
									}
								})()}
								{fieldErrors[field.id] && <p className="text-sm text-red-500">{fieldErrors[field.id]}</p>}
							</div>
						</div>
					))}
					<section className="px-4">{additionalContent}</section>
				</div>
				<SheetFooter>
					<Button onClick={handleSubmit} disabled={buttonDisabled}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{sheetFooterButton}
					</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
