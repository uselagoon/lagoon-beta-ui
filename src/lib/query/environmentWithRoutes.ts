import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!) {
    environmentRoutes: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      name
      kubernetesNamespaceName
      environmentType
      project {
        id
        name
        problemsUi
        factsUi
        productionEnvironment
        standbyProductionEnvironment
        environments {
          id
          name
        }
      }
      pendingChanges {
        details
      }
      services {
        name
      }
			apiRoutes {
				id
				domain
				primary
				type
        service
				created
				updated
        environment {
          id
          name
        }
				source
			}
    }
  }
`;
