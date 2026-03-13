import FactsFragment from '@/lib/fragment/fact';
import { gql } from '@apollo/client';

export default gql`
  query getEnvironment($openshiftProjectName: String!) {
    environment: environmentByOpenshiftProjectName(openshiftProjectName: $openshiftProjectName) {
      id
      facts {
        ...factFields
      }
    }
  }
  ${FactsFragment}
`;
