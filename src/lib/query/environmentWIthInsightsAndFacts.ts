import FactsFragment from '@/lib/fragment/fact';
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
      insights {
        id
        file
        fileId
        service
        type
        size
        created
      }
      facts {
        ...factFields
      }
      pendingChanges {
        details
      }
    }
  }
  ${FactsFragment}
`;
