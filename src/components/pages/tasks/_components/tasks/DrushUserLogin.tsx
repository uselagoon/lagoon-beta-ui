import React, { FC, Fragment, startTransition } from 'react';

import { EnvironmentWithTasks } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import taskDrushUserLogin from '@/lib/mutation/tasks/taskDrushUserLogin';
import { useMutation } from '@apollo/client';
import { Button, Select, SelectWithOptions } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  environment: EnvironmentWithTasks;
  refetch: () => void;
}

const DrushUserLogin: FC<Props> = ({ environment, refetch }) => {
  const [taskDrushUserLoginMutation, { loading }] = useMutation(taskDrushUserLogin, {
    onError: err => {
      console.error(err);
      toast.error('There was a problem running drush uli.', {
        id: 'task_error',
        description: (err as { message: string })?.message,
      });
    },
    variables: {
      environment: environment.id,
    },
    refetchQueries: ['getEnvironment'],
  });

  const handleTask = async () => {
    await taskDrushUserLoginMutation();
    startTransition(() => {
      refetch();
    });
  };

  return (
    <>
      <div className="flex flex-col max-w-[30%] gap-3">
        <label className="leading-6" id="dest-env">
          Environment:
        </label>
        <SelectWithOptions
          aria-labelledby="dest-env"
          placeholder={environment.name}
          options={[
            {
              label: environment.name,
              value: environment.id,
            },
          ]}
          disabled
        />

        <Button className="max-w-max" data-cy="task-btn" disabled={loading} onClick={handleTask}>
          {loading && <Loader2 className="animate-spin" />}
          Run task
        </Button>
      </div>
    </>
  );
};

export default DrushUserLogin;
