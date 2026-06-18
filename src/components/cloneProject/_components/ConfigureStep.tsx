import { FC, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  SelectWithOptions,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui-library';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';

import addOrganizationKeyToProject from '@/lib/mutation/organizations/addOrganizationKeyToProject';
import { CloneOptions, CLONE_OPTIONS_CONFIG, validateName } from './types';
import { OrganizationKey } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';

interface EnvironmentOption {
  label: string;
  value: string;
}

interface ConfigureStepProps {
  projectName: string;
  newProjectName: string;
  setNewProjectName: (value: string) => void;
  nameError: string | null;
  setNameError: (error: string | null) => void;
  nameValidationActive: boolean;
  setNameValidationActive: (touched: boolean) => void;
  selectedEnvironment: string;
  setSelectedEnvironment: (value: string) => void;
  environmentOptions: EnvironmentOption[];
  environmentsEmpty: boolean;
  envLoading: boolean;
  options: CloneOptions;
  setOptions: React.Dispatch<React.SetStateAction<CloneOptions>>;
  isFormValid: boolean;
  onClone: () => void;
  onClose: () => void;
  organizationSlug?: string;
  keys: OrganizationKey[];
  selectedKey: string;
  setSelectedKey: (value: string) => void;
  onKeyAdded?: () => void;
  keyAdded?: boolean;
  publicGitUrl: boolean;
}

export const ConfigureStep: FC<ConfigureStepProps> = ({
  projectName,
  newProjectName,
  setNewProjectName,
  nameError,
  setNameError,
  nameValidationActive,
  setNameValidationActive,
  selectedEnvironment,
  setSelectedEnvironment,
  environmentOptions,
  environmentsEmpty,
  envLoading,
  options,
  setOptions,
  isFormValid,
  onClone,
  onClose,
  organizationSlug,
  keys,
  selectedKey,
  setSelectedKey,
  onKeyAdded,
  keyAdded,
  publicGitUrl,
}) => {
  const allChecked = CLONE_OPTIONS_CONFIG.every(({ key }) => options[key]);
  const someChecked = CLONE_OPTIONS_CONFIG.some(({ key }) => options[key]);

  const [keyStatus, setkeyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [keyError, setkeyError] = useState<string>('');

  const [addKeyToProjectMutation, { loading: keyLoading }] = useMutation(addOrganizationKeyToProject);

  const handleToggleAll = () => {
    const next = !allChecked;
    setOptions(prev => Object.fromEntries(Object.keys(prev).map(k => [k, next])) as unknown as typeof prev);
  };

  const handleAddKey = async () => {
    if (!selectedKey) return;
    setkeyStatus('idle');
    setkeyError('');
    try {
      await addKeyToProjectMutation({
        variables: {
          id: Number(selectedKey),
          project: projectName,
        },
      });
      setkeyStatus('success');
      onKeyAdded?.();
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Unknown error';
      setkeyStatus('error');
      setkeyError(message);
    }
  };

  const selectedKeyName = keys.find(key => String(key.id) === selectedKey)?.name ?? '';
  const sourceProjectHasKey = keys.some(key => key.projects?.some(proj => proj.name === projectName));

  return (
    <>
      <DialogHeader>
        <DialogTitle>Clone Project</DialogTitle>
        <DialogDescription>Create a copy of {projectName}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="clone-name">
            New Project Name <span className="text-destructive">*</span>
          </Label>
          <input
            id="clone-name"
            type="text"
            value={newProjectName}
            onChange={e => {
              setNewProjectName(e.target.value);
              if (nameValidationActive) setNameError(validateName(e.target.value));
            }}
            onBlur={() => {
              setNameValidationActive(true);
              setNameError(validateName(newProjectName));
            }}
            autoFocus
            aria-required="true"
            aria-describedby={nameValidationActive && nameError ? 'clone-name-error' : 'clone-name-helper'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {nameValidationActive && nameError ? (
            <p id="clone-name-error" className="text-sm text-destructive">
              {nameError}
            </p>
          ) : (
            <p id="clone-name-helper" className="text-sm text-muted-foreground">
              Choose a unique name for the cloned project
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source-environment">
            Source Environment <span className="text-destructive">*</span>
          </Label>
          {envLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading environments...
            </div>
          ) : (
            <SelectWithOptions
              placeholder="Select an environment"
              options={environmentOptions}
              value={selectedEnvironment}
              onValueChange={setSelectedEnvironment}
            />
          )}
          {!envLoading && !environmentsEmpty && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground">
                  Select an environment to be cloned. &#9432;
                </p>
              </TooltipTrigger>
              <TooltipContent>
                Only Branch environments are available for cloning, and they must have been deployed successfully at least once.
              </TooltipContent>
            </Tooltip>
          )}
          {environmentsEmpty && !envLoading && (
            <p className="text-sm text-muted-foreground">No environments available</p>
          )}
        </div>

        {!publicGitUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Add your Organization key (private repositories only)
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectWithOptions
                  placeholder={keys.length > 0 ? 'Select an organization key' : 'No keys available'}
                  options={keys.map(key => ({ label: key.name, value: key.id }))}
                  value={selectedKey}
                  disabled={sourceProjectHasKey}
                  onValueChange={value => {
                    setSelectedKey(value);
                    setkeyStatus('idle');
                    setkeyError('');
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!selectedKey || keyLoading || sourceProjectHasKey}
                onClick={handleAddKey}
              >
                {keyLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Key'
                )}
              </Button>
              {selectedKey && keyStatus !== 'success' && !keyAdded && !sourceProjectHasKey && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className="h-5 w-5 text-yellow-500 cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    You have selected a key but haven't added it to the project yet. Click "Add Key" before cloning.
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {sourceProjectHasKey && (
              <p className="text-sm text-muted-foreground">
                This project already has an organization key assigned.
              </p>
            )}
            {(keyStatus === 'success' || keyAdded) && (
              <p className="text-sm text-green-600">
                Key "{selectedKeyName}" added to {projectName}.
              </p>
            )}
            {keyStatus === 'error' && (
              <p className="text-sm text-destructive">
                Error: {keyError}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              {!sourceProjectHasKey && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p>Select a key to link your cloned project to your organization. &#9432;</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    Organization keys are required for cloning private repositories. Add this project's Deploy Key to your Git service.
                  </TooltipContent>
                </Tooltip>
              )}
              <Link href={`/organizations/${organizationSlug}/keys`} className="underline">
                Don't have an organization key? Create a key here.
              </Link>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <p className="text-sm font-medium">What to clone</p>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3 pb-2 border-b">
              <Checkbox
                id="clone-opt-all"
                label=""
                checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                onCheckedChange={handleToggleAll}
              />
              <label htmlFor="clone-opt-all" className="text-sm font-medium leading-none cursor-pointer">
                Select all
              </label>
            </div>
            {CLONE_OPTIONS_CONFIG.map(({ key, label, description }) => (
              <div key={key} className="flex items-start space-x-3">
                <Checkbox
                  id={`clone-opt-${key}`}
                  label=""
                  checked={options[key]}
                  onCheckedChange={checked => setOptions(prev => ({ ...prev, [key]: !!checked }))}
                />
                <div className="grid gap-0.5 leading-none">
                  <label htmlFor={`clone-opt-${key}`} className="text-sm font-medium leading-none cursor-pointer">
                    {label}
                  </label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            The new project will be created with the same configuration as {projectName}. You can modify it after
            creation.
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!isFormValid || envLoading} onClick={onClone}>
          Clone Project
        </Button>
      </DialogFooter>
    </>
  );
};
