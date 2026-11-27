import ProblemsFragment from '@/lib/fragment/problem';
import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!) {
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
      pendingChanges {
        details
      }
      problems {
        ...problemFields
      }
    }
  }
  ${ProblemsFragment}
`;
