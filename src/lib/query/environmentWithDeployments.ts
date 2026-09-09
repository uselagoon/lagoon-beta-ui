import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!, $limit: Int) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      kubernetesNamespaceName
      deployType
      deployBaseRef
      deployHeadRef
      deployTitle
      project {
        name
        problemsUi
        factsUi
        featureApiRoutes
      }
      pendingChanges {
        details
      }
      deployments(limit: $limit) {
        id
        name
        status
        created
        buildStep
        started
        completed
        bulkId
        priority
        sourceType
      }
    }
  }
`;
