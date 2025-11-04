import { PreloadQuery } from '@/lib/apolloClient';
import { QueryRef } from '@apollo/client';
import { ProjectEnvironment } from '../../(project-overview)/page';
import environmentWithRoutes from '@/lib/query/environmentWithRoutes';
import EnvironmentRoutesPage from '@/components/pages/environmentRoutes/EnvironmentRoutesPage';

type Props = {
	params: Promise<{ environmentSlug: string }>;
};

type Environment = {
	id: number;
	name: string;
	kubernetesNamespaceName: string;
	environmentType: string;
	apiRoutes: EnvironmentRoute[];
	project: Project;
};

export type EnvironmentRoute = {
	id: number;
	domain: string;
	type: string;
	primary: boolean;
	environment: Environment;
	service: string;
	created: string;
	updated: string;
	source: string;
};

type Project = {
	id: number;
	name: string;
	environments: ProjectEnvironment[];
	productionEnvironment?: string;
	standbyProductionEnvironment?: string;
};

export interface EnvironmentRoutesData {
	environmentRoutes: Environment;
}

export async function generateMetadata(props: Props) {
	const params = await props.params;
	return {
		title: `${params.environmentSlug} | Environment Routes`,
	};
}

export default async function Routes(props: {
	params: Promise<{ environmentSlug: string; projectSlug: string }>;
}) {
	const params = await props.params;

	const { projectSlug, environmentSlug} = params;

	return (
		<PreloadQuery
			query={environmentWithRoutes}
			variables={{
				openshiftProjectName: environmentSlug
			}}
		>
			{queryRef => (
				<EnvironmentRoutesPage
					projectName={projectSlug}
					queryRef={queryRef as QueryRef<EnvironmentRoutesData>}
				/>
			)}
		</PreloadQuery>
	);
}
