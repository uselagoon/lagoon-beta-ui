export const getBadgeVariant = (status: string, buildStep: string | null | undefined) => {
	switch (status) {
		case 'successful':
		case 'succeeded':
		case 'complete':
			if (buildStep && ['deployCompletedWithWarnings'].includes(buildStep)){
				return 'warning' as const;
			}
			return 'success' as const;
		case 'failed':
		case 'cancelled':
			return 'danger' as const;
		default:
			return 'neutral' as const;
	}
}

export const getBadgeEnvVariant = (type: string) => {
	switch (type) {
		case 'production':
		case 'active production':
			return 'production' as const;
		case 'development':
			return 'development' as const;
		case 'standby production':
			return 'standby' as const;
		default:
			return 'neutral' as const;
	}
}

export const getBadgeRouteVariant = (type: string) => {
	switch (type) {
		case 'primary':
			return 'secondary' as const;
		case 'active':
			return 'production' as const;
		case 'standby':
			return 'standby' as const;
		default:
			return 'neutral' as const;
	}
}