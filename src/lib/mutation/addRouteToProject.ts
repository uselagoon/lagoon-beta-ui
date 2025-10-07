import { gql } from '@apollo/client';

export default gql`
    mutation addRouteToProject($input: AddRouteToProjectInput!) {
        addRouteToProject(input: $input) {
            id
        }
    }
`;