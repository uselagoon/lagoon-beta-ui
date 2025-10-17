import { gql } from '@apollo/client';

export default gql`
	query getProject($name: String!) {
		projectRoutes: projectByName(name: $name) {
			id
			productionEnvironment
			standbyProductionEnvironment
			apiRoutes {
				id
				domain
				primary
				type
				environment {
					id
					name
					kubernetesNamespaceName
					environmentType
				}
				service
				created
				updated
				source
			}
			environments {
				id
				name
				kubernetesNamespaceName
			}
		}
	}
`;
