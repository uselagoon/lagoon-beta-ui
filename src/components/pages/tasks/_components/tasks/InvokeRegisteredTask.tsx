import React, { FC, Fragment, startTransition, useEffect, useState } from 'react';

import {
  AdvancedTaskDefinitionArgument,
  EnvironmentWithTasks,
} from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import invokeRegisteredTask from '@/lib/mutation/tasks/invokeRegisteredTask';
import { useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Notification,
  SelectWithOptions,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export type AdvancedTaskType = {
  id: number;
  label: string;
  value: string;
  arguments: AdvancedTaskDefinitionArgument[];
  confirmationText?: string;
};

interface Props {
  environment: EnvironmentWithTasks;
  advancedTask: AdvancedTaskType;
  refetch: () => void;
}

const InvokeRegisteredTask: FC<Props> = ({ environment, advancedTask, refetch }) => {
  const [advancedTaskArguments, setAdvancedTaskArguments] = useState<Record<string, any>>({});

  const [invokeRegisteredTaskMutation, { loading }] = useMutation(invokeRegisteredTask, {
    onError: err => {
      console.error(err);
      toast.error('There was a problem running drush archive-dump', {
        id: 'cancel_error',
        description: (err as { message: string })?.message,
      });
    },
    variables: {
      environment: environment.id,
    },
    refetchQueries: ['getEnvironment'],
  });

  const handleAdvancedTask = async () => {
    await invokeRegisteredTaskMutation({
      variables: {
        environment: environment.id,
        taskRegistration: advancedTask.id,
        argumentValues: (function () {
          let taskArgs: {
            advancedTaskDefinitionArgumentName: string;
            value: string | number;
          }[] = [];

          Object.keys(advancedTaskArguments).forEach(function (key) {
            var value = advancedTaskArguments[key];
            taskArgs.push({ advancedTaskDefinitionArgumentName: key, value: value });
          });
          return taskArgs;
        })(),
      },
    });
    startTransition(() => {
      refetch();
    });
  };

  useEffect(() => {
    let defaultArgValues: Record<string, string | number | boolean> = {};
    advancedTask.arguments.forEach(item => {
      if (item.defaultValue) {
        defaultArgValues[item.name] = item.defaultValue;
      }
    });
    setAdvancedTaskArguments(defaultArgValues);
  }, []);

  let taskArgumentsExist = false;
  let argumentVariablesHaveValues = true;

  if (advancedTask.arguments) {
    taskArgumentsExist = true;

    argumentVariablesHaveValues = advancedTask.arguments.reduce((allValid, currentArgument) => {
      const argumentName = currentArgument.name;
      const isArgumentOptional = currentArgument.optional;

      const hasValue =
        advancedTaskArguments[argumentName] !== undefined && advancedTaskArguments[argumentName] !== null;
      if (!isArgumentOptional && !hasValue) {
        return false;
      }

      // optional arguments can be missing or have a value, so we allow it
      return allValid && true;
    }, true);
  }

  const renderFields = () => {
    return (
      advancedTask.arguments &&
      advancedTask.arguments.map((arg, index) => {
        switch (arg.type) {
          case 'ENVIRONMENT_SOURCE_NAME':
          case 'ENVIRONMENT_SOURCE_NAME_EXCLUDE_SELF':
            return (
              <div className='className="flex flex-col max-w-[40%] gap-3"' key={`env-text-${index}`}>
                <label className="leading-6" id="source-env">
                  {arg.displayName || arg.name}:
                </label>
                <SelectWithOptions
                  aria-labelledby={arg.name}
                  placeholder="Select environment..."
                  value={advancedTaskArguments[arg.name]}
                  onValueChange={selectedOption => {
                    setAdvancedTaskArguments({
                      ...advancedTaskArguments,
                      [arg.name]: selectedOption,
                    });
                  }}
                  options={arg.range?.map(opt => ({ label: opt, value: opt }))}
                />
              </div>
            );

          default:
            return (
              <div className="flex flex-col max-w-[40%] gap-3" key={`env-text-${index}`}>
                <label className="leading-6" id="source-env">
                  {arg.displayName || arg.name}:
                </label>
                <Input
                  label=""
                  type="text"
                  name={arg.name}
                  value={advancedTaskArguments[arg.name]}
                  onChange={event => {
                    setAdvancedTaskArguments({
                      ...advancedTaskArguments,
                      [arg.name]: event.target.value,
                    });
                  }}
                />
              </div>
            );
        }
      })
    );
  };

  return (
    <>
      {renderFields()}

      {(advancedTask.confirmationText && (
        <>
          <Notification
            title="Confirm action"
            message={advancedTask.confirmationText}
            cancelText="Cancel"
            confirmText="Confirm task"
            onConfirm={handleAdvancedTask}
          >
            <Button disabled={loading}>{loading && <Loader2 className="animate-spin" />} Run task</Button>
          </Notification>
        </>
      )) || (
        <Button
          className="mt-4"
          data-cy="task-btn"
          disabled={(taskArgumentsExist && !argumentVariablesHaveValues) || loading}
          onClick={handleAdvancedTask}
        >
          {loading && <Loader2 className="animate-spin" />} Run task
        </Button>
      )}
    </>
  );
};
export default InvokeRegisteredTask;
