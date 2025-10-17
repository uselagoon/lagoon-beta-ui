import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($openshiftProjectName: String!) {
    environmentRoutes: environmentByOpenshiftProjectName(openshiftProjectName: $openshiftProjectName) {
      id
      name
      kubernetesNamespaceName
      openshiftProjectName
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
