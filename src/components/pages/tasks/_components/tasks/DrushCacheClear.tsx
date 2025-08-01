import React, { FC, startTransition } from 'react';

import { EnvironmentWithTasks } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import taskDrushCacheClear from '@/lib/mutation/tasks/taskDrushCacheClear';
import { useMutation } from '@apollo/client';
import { Button, SelectWithOptions } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  environment: EnvironmentWithTasks;
  refetch: () => void;
}

const DrushCacheClear: FC<Props> = ({ environment, refetch }) => {
  const [taskDrushCacheClearMutation, { loading }] = useMutation(taskDrushCacheClear, {
    onError: err => {
      console.error(err);

      toast.error('There was a problem running drush cache-clear.', { id: 'task_error', description: err?.message });
    },
    variables: {
      environment: environment.id,
    },
    refetchQueries: ['getEnvironment'],
  });

  const handleTask = async () => {
    await taskDrushCacheClearMutation();
    startTransition(() => {
      refetch();
    });
  };

  return (
    <>
      <div className="flex flex-col max-w-[30%] gap-3">
        <label id="dest-env">Environment:</label>
        <SelectWithOptions
          aria-labelledby="dest-env"
          aria-required
          placeholder=""
          value={environment.name}
          options={[
            {
              label: environment.name,
              value: environment.name,
            },
          ]}
        />

        <Button className="max-w-max" data-cy="task-btn" disabled={loading} onClick={handleTask}>
          {loading && <Loader2 className="animate-spin" />}
          Run task
        </Button>
      </div>
    </>
  );
};

export default DrushCacheClear;
