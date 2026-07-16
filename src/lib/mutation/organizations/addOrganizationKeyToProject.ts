import { gql } from '@apollo/client';

export default gql`
  mutation addOrganizationKeyToProject($id: Int!, $project: String!) {
    addOrganizationKeyToProject(id: $id, project: $project) {
      id
    }
  }
`;