import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@ui-lib/components/ui/alert-dialog';
import { ReactNode } from 'react';

type NotificationProps = {
	title: string;
	message: ReactNode;
	cancelText?: string;
	onCancel?: () => void;
	confirmText?: ReactNode;
	confirmDisabled?: boolean;
	onConfirm?: () => void;
} & (
	| { children?: ReactNode }
	| {
			open?: boolean;
			onOpenChange?: (open: boolean) => void;
		}
);

export default function Notification({
	title,
	message,
	cancelText,
	onCancel,
	confirmText,
	confirmDisabled = false,
	onConfirm,
	...rest
}: NotificationProps) {
	const alertDialogProps =
		'open' in rest && 'onOpenChange' in rest
			? { open: rest.open, onOpenChange: rest.onOpenChange }
			: {};

	return (
		<AlertDialog {...alertDialogProps}>
			<AlertDialogTrigger asChild>{'children' in rest ? rest.children : null}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => {
							onCancel && onCancel();
						}}
					>
						{cancelText ?? 'Cancel'}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={confirmDisabled}
						onClick={(e) => {
							if ('onOpenChange' in rest) {
								e.preventDefault();
							}
							onConfirm && onConfirm();
						}}
					>
						{confirmText ?? 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
