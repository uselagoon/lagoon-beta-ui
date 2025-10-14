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
        		}
          		service
				created
				updated
			}
			environments {
				id
				name
				kubernetesNamespaceName
			}
		}
	}
`;
