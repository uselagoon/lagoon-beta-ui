import FactsFragment from '@/lib/fragment/fact';
import gql from 'graphql-tag';

export default gql`
  query getEnvironment($kubernetesNamespaceName: String!) {
    environment: environmentByKubernetesNamespaceName(kubernetesNamespaceName: $kubernetesNamespaceName) {
      id
      facts {
        ...factFields
      }
    }
  }
  ${FactsFragment}
`;
