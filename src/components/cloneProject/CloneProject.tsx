'use client';

import { FC, useMemo, useState } from 'react';

import cloneProjectMutation from '@/lib/mutation/organizations/cloneProject';
import projectCloneStatus from '@/lib/query/organizations/projectCloneStatus';
import projectEnvironmentsForClone from '@/lib/query/organizations/projectEnvironmentsForClone';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, Dialog, DialogContent, DialogTrigger } from '@/ui-library';
import { CopyPlus } from 'lucide-react';

import { ConfigureStep } from './_components/ConfigureStep';
import { ErrorStep, ProgressStep, SuccessStep } from './_components/ResultSteps';
import { CloneOptions, CLONE_OPTIONS_CONFIG, DialogStep, Environment, NAME_PATTERN, validateName } from './_components/types';

export type { CloneOptions } from './_components/types';

interface CloneProjectProps {
  projectName: string;
  refetch?: () => void;
}

export const CloneProject: FC<CloneProjectProps> = ({ projectName, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>('configure');
  const [newProjectName, setNewProjectName] = useState(`${projectName}-copy`);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameValidationActive, setNameValidationActive] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [clonedProjectName, setClonedProjectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState<CloneOptions>({
    copyData: true,
    metadata: true,
    groups: true,
    notifications: true,
    projectVariables: true,
    environmentVariables: true,
  });

  const [fetchEnvironments, { data: envData, loading: envLoading }] = useLazyQuery(projectEnvironmentsForClone, {
    variables: { name: projectName },
    fetchPolicy: 'network-only',
  });

  const [cloneProject] = useMutation(cloneProjectMutation, {
    onCompleted: data => {
      setClonedProjectName(data.cloneProject.name);
      setStep('success');
      refetch?.();
    },
    onError: err => {
      setErrorMessage(err.message);
      setStep('error');
    },
  });

  const cloneStatusQuery = useQuery(projectCloneStatus, {
    variables: { name: clonedProjectName },
    skip: step !== 'success' || !clonedProjectName,
    pollInterval: step === 'success' ? 15000 : 0,
    fetchPolicy: 'network-only',
  });

  const cloneStatus: string | undefined = cloneStatusQuery.data?.project?.clone?.status;

  const environments: Environment[] = useMemo(
    () => envData?.project?.environments ?? [],
    [envData?.project?.environments]
  );

  const environmentOptions = useMemo(() => {
    return environments.map(env => ({
      label: `${env.name} (${env.environmentType})`,
      value: env.name,
    }));
  }, [environments]);

  const resetForm = () => {
    setNewProjectName(`${projectName}-copy`);
    setSelectedEnvironment('');
    setNameError(null);
    setNameValidationActive(false);
    setErrorMessage('');
    setClonedProjectName('');
    setOptions({
      copyData: true,
      metadata: true,
      groups: true,
      notifications: true,
      projectVariables: true,
      environmentVariables: true,
    });
    setStep('configure');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchEnvironments();
      resetForm();
    }
  };

  const handleClone = async () => {
    const validationError = validateName(newProjectName);
    if (validationError || !selectedEnvironment) {
      setNameError(validationError);
      setNameValidationActive(true);
      return;
    }

    setStep('progress');

    await cloneProject({
      variables: {
        projectName: newProjectName.trim(),
        sourceProjectName: projectName,
        sourceEnvironmentName: selectedEnvironment,
        copyData: options.copyData,
        metadata: options.metadata,
        groups: options.groups,
        notifications: options.notifications,
        projectVariables: options.projectVariables,
        environmentVariables: options.environmentVariables,
      },
    });
  };

  const handleRetry = () => {
    setStep('configure');
    setErrorMessage('');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isNameValid = newProjectName.trim().length > 0 && NAME_PATTERN.test(newProjectName.trim());
  const isFormValid = isNameValid && !!selectedEnvironment;

  const selectedOptionsLabels = CLONE_OPTIONS_CONFIG.filter(opt => options[opt.key]).map(opt => opt.label);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="clone-project">
          <CopyPlus className="h-4 w-4 mr-2" />
          Clone Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {step === 'configure' && (
          <ConfigureStep
            projectName={projectName}
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            nameError={nameError}
            setNameError={setNameError}
            nameValidationActive={nameValidationActive}
            setNameValidationActive={setNameValidationActive}
            selectedEnvironment={selectedEnvironment}
            setSelectedEnvironment={setSelectedEnvironment}
            environmentOptions={environmentOptions}
            environmentsEmpty={environments.length === 0}
            envLoading={envLoading}
            options={options}
            setOptions={setOptions}
            isFormValid={isFormValid}
            onClone={handleClone}
            onClose={handleClose}
          />
        )}

        {step === 'progress' && <ProgressStep />}

        {step === 'success' && (
          <SuccessStep
            projectName={projectName}
            clonedProjectName={clonedProjectName}
            selectedOptionsLabels={selectedOptionsLabels}
            cloneStatus={cloneStatus}
            onClose={handleClose}
          />
        )}

        {step === 'error' && (
          <ErrorStep errorMessage={errorMessage} onRetry={handleRetry} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CloneProject;
