export const getBadgeVariant = (status: string, buildStep: string | null | undefined) => {
	switch (status) {
		case 'complete':
			if (buildStep && ['deployCompletedWithWarnings'].includes(buildStep)){
				return 'warning' as const;
			}
			return 'success' as const;
		case 'failed':
		case 'cancelled':
			return 'error' as const;
		default:
			return 'default' as const;
	}
}