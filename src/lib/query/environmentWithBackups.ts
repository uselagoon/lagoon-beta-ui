import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!, $limit: Int) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      kubernetesNamespaceName
      deployType
      deployBaseRef
      deployTitle
      project {
        id
        name
        problemsUi
        factsUi
        featureApiRoutes
      }
      pendingChanges {
        details
      }
      backups(limit: $limit) {
        id
        source
        backupId
        created
        restore {
          id
          status
          restoreSize
        }
      }
    }
  }
`;
