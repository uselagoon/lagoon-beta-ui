import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!, $taskName: String!) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      name
      kubernetesNamespaceName
      project {
        id
        name
        problemsUi
        factsUi
        featureApiRoutes
      }
      tasks(taskName: $taskName) {
        id
        name
        taskName
        status
        created
        started
        completed
        service
        logs
        adminOnlyView
        files {
          id
          filename
        }
      }
    }
  }
`;
