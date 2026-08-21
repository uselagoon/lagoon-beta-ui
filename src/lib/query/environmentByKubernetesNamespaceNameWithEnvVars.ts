import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!) {
    environmentVars: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      name
      created
      updated
      deployType
      environmentType
      routes
      kubernetesNamespaceName
      envVariables {
        id
        name
        scope
      }
      pendingChanges {
        details
      }
      project {
        name
        gitUrl
        productionRoutes
        standbyRoutes
        productionEnvironment
        standbyProductionEnvironment
        problemsUi
        factsUi
        featureApiRoutes
        envVariables {
          id
          name
          scope
        }
      }
    }
  }
`;
