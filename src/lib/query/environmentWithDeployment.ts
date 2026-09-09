import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!, $deploymentName: String!) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      kubernetesNamespaceName
      project {
        name
        problemsUi
        factsUi
        featureApiRoutes
      }
      deployments(name: $deploymentName) {
        id
        name
        status
        sourceType
        created
        buildStep
        started
        completed
        buildLog
        bulkId
        priority
      }
    }
  }
`;
