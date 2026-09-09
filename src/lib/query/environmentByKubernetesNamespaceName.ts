import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      name
      created
      updated
      deployType
      environmentType
      routes
      kubernetesNamespaceName
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
      }
      pendingChanges {
        details
      }
    }
  }
`;
