import { gql } from '@apollo/client';

export default gql`
  mutation deployEnvironmentLatest($environmentId: Int!, $envVarOnly: String = "false") {
    deployEnvironmentLatest(input: { environment: { id: $environmentId },
      buildVariables: [
        {
          name: "LAGOON_VARIABLES_ONLY",
          value: $envVarOnly
        }
      ]
    })
  }
`;
