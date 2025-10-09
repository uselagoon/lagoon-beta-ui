import { gql } from '@apollo/client';

export default gql`
	query getProject($name: String!) {
		projectRoutes: projectByName(name: $name) {
			id
			apiRoutes {
				id
				domain
				primary
				type
				environment {
					id
					name
        		}
          		service
			}
		}
	}
`;
