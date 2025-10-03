// import InsightsPage from '@/components/pages/insights/InsightsPage';
// import { PreloadQuery } from '@/lib/apolloClient';
// import environmentWIthInsightsAndFacts from '@/lib/query/environmentWIthInsightsAndFacts';
import { QueryRef } from '@apollo/client';
import RoutesPage from "@/components/pages/routes/RoutesPage";

export default async function Routes(props: { params: Promise<{ environmentSlug: string }> }) {

	return (
		<RoutesPage  />
	);
}
