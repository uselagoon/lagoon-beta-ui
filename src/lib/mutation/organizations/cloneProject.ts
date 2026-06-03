import { gql } from '@apollo/client';

export default gql`
  mutation cloneProject(
    $projectName: String!
    $sourceProjectName: String!
    $sourceEnvironmentName: String!
    $copyData: Boolean
    $metadata: Boolean
    $projectVariables: Boolean
    $notifications: Boolean
    $groups: Boolean
    $environmentVariables: Boolean
  ) {
    cloneProject(
      input: {
        projectName: $projectName
        sourceProject: {
          name: $sourceProjectName
          metadata: $metadata
          projectVariables: $projectVariables
          notifications: $notifications
          groups: $groups
        }
        sourceEnvironment: {
          name: $sourceEnvironmentName
          environmentVariables: $environmentVariables
          copyData: $copyData
        }
      }
    ) {
      id
      name
    }
  }
`;
