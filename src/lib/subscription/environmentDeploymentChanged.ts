import { gql } from '@apollo/client';

export const deploymentChangedFragment = gql`
  fragment DeploymentChangedFields on Deployment {
    id
    name
    status
    created
    started
    completed
    buildStep
    priority
    bulkId
    sourceType
  }
`;

export default gql`
  subscription subscribeToDeployments($environment: Int!) {
    deploymentChanged(environment: $environment) {
      ...DeploymentChangedFields
    }
  }
  ${deploymentChangedFragment}
`;
