import React from 'react';
import { Sheet } from "@uselagoon/ui-library";
import { useMutation } from '@apollo/client';
import addProjectToOrganization from '@/lib/mutation/organizations/addProjectToOrganization';

const AddProjectSheet = ({
                             organizationId,
                             deployTargetOptions
                         }: {
    organizationId: number;
    deployTargetOptions: Array<{ label: string; value: string | number }>;
}) => {
    const [addProjectMutation, { error, loading }] = useMutation(addProjectToOrganization, {
        refetchQueries: ['getOrganization'],
    });

    const handleAddProject = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
        try {
            const { projectName, gitUrl, prodEnv, deployTarget, branches, pullRequests, addUserToProject } = values;
            const hasSpaces = (str: string) => str?.indexOf(' ') > 0;

            if (hasSpaces(projectName) || hasSpaces(gitUrl) || hasSpaces(prodEnv)) {
                console.error('Project name, Git URL, and Production environment cannot contain spaces');
                return false;
            }
            await addProjectMutation({
                variables: {
                    organization: organizationId,
                    name: projectName,
                    gitUrl: gitUrl,
                    productionEnvironment: prodEnv,
                    kubernetes: parseInt(deployTarget, 10),
                    ...(pullRequests ? { pullrequests: pullRequests } : {}),
                    ...(branches ? { branches: branches } : {}),
                    addOrgOwner: addUserToProject,
                },
            });

        } catch (err) {
            console.error('Error adding project:', err);
        }
    };

    const projectCreationInfo = (
        <>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p className="font-medium text-blue-800 mb-2">Important:</p>
        <p className="text-blue-700">
            Once the project has been created you will need to add the{' '}
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.lagoon.sh/installing-lagoon/add-project/#add-the-deploy-key-to-your-git-repository"
                className="underline hover:text-blue-900"
            >
                Deploy Key
            </a>{' '}
            and{' '}
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.lagoon.sh/installing-lagoon/add-project/#add-the-webhooks-endpoint-to-your-git-repository"
                className="underline hover:text-blue-900"
            >
                Webhook
            </a>{' '}
            to your Git service. These will be generated in the 'create environment' wizard available from the project overview page.
        </p>
    </div>
    {error && (
        <div className="text-red-500 p-3 border border-red-300 rounded-md bg-red-50">
            <strong>Error creating project:</strong> {error.message}
        </div>
    )}
    </>
)

    return (
        <div className="space-y-4">
            <Sheet
                sheetTrigger="Create Project"
                sheetTitle="Create a project"
                sheetDescription="Fill in the project details below. Note: After creation, you'll need to add the Deploy Key and Webhook to your Git service."
                sheetFooterButton="Create"
                loading={loading}
                buttonAction={handleAddProject}
                additionalContent={projectCreationInfo}
                error={!!error}
                sheetFields={[
                    {
                        id: 'projectName',
                        label: 'Project name',
                        type: 'text',
                        placeholder: 'Enter a project name',
                        required: true,
                    },
                    {
                        id: 'gitUrl',
                        label: 'Git URL',
                        type: 'text',
                        placeholder: 'Enter the URL',
                        required: true,
                    },
                    {
                        id: 'prodEnv',
                        label: 'Production environment',
                        type: 'text',
                        placeholder: 'Enter prod environment',
                        required: true,
                    },
                    {
                        id: 'deployTarget',
                        label: 'Deploy Target',
                        type: 'select',
                        placeholder: 'Select deploy target',
                        options: deployTargetOptions,
                        required: true,
                    },
                    {
                        id: 'branches',
                        label: 'Branches',
                        type: 'text',
                        placeholder: 'Branches (default: true)',
                    },
                    {
                        id: 'pullRequests',
                        label: 'Pull requests',
                        type: 'text',
                        placeholder: 'Pull requests (default: true)',
                    },
                    {
                        id: 'addUserToProject',
                        label: 'Add my user to this project',
                        type: 'checkbox',
                        inputDefault: 'true',
                    },
                ]}
            />
        </div>
    );
};

export default AddProjectSheet;