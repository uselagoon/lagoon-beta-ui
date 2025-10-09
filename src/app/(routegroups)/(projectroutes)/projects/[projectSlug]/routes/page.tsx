import { PreloadQuery } from '@/lib/apolloClient';
import { QueryRef } from '@apollo/client';
import RoutesPage from "@/components/pages/routes/RoutesPage";
import projectWithRoutes from "@/lib/query/projectWithRoutes";

type Props = {
	params: Promise<{ projectSlug: string }>;
};

type Environment = {
	id: number;
	name: string;
};

export type Route = {
	id: number;
	domain: string;
	type: string;
	primary: boolean;
	environment: Environment;
	service: string;
};

type Project = {
	id: number;
	name: string;
	apiRoutes: Route[];
};

export interface RoutesData {
	projectRoutes: Project;
}

export async function generateMetadata(props: Props) {
	const params = await props.params;
	return {
		title: `${params.projectSlug} | Project Routes`,
	};
}

export default async function Routes(props: {
	params: Promise<{ projectSlug: string }>;
}) {
	const params = await props.params;

	const { projectSlug } = params;

	return (
		<PreloadQuery
			query={projectWithRoutes}
			variables={{
				name: projectSlug,
			}}
		>
			{queryRef => (
				<RoutesPage
					projectName={projectSlug}
					queryRef={queryRef as QueryRef<RoutesData>}
				/>
			)}
		</PreloadQuery>
	);
}
