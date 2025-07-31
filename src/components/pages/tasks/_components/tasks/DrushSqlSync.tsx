import React, { FC, startTransition, useState } from 'react';

import { EnvironmentWithTasks } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import taskDrushSqlSync from '@/lib/mutation/tasks/taskDrushSqlSync';
import { useMutation } from '@apollo/client';
import { Button, SelectWithOptions } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  environment: EnvironmentWithTasks;
  refetch: () => void;
  allButCurrentEnvironments: {
    id: number;
    name: string;
  }[];
}

const DrushSqlSync: FC<Props> = ({ environment, refetch, allButCurrentEnvironments }) => {
  const [selectedSourceEnv, setSelectedSourceEnv] = useState<number>();

  const [taskDrushSqlSyncMutation, { loading }] = useMutation(taskDrushSqlSync, {
    onError: err => {
      console.error(err);
      toast.error('There was a problem running drush sql-sync', {
        id: 'task_error',
        description: (err as { message: string })?.message,
      });
    },
    refetchQueries: ['getEnvironment'],
  });

  const handleTask = async () => {
    await taskDrushSqlSyncMutation({
      variables: {
        sourceEnvironment: selectedSourceEnv,
        destinationEnvironment: environment.id,
      },
    });
    startTransition(() => {
      refetch();
    });
  };

  const options = allButCurrentEnvironments.map(env => ({
    label: env.name,
    value: env.id,
  }));

  return (
    <>
      <div className="flex flex-col max-w-[40%] gap-3">
        <div className="warning px-4 py-3 bg-pink-500 rounded text-[0.95rem]">
          <div className="flex flex-col gap-2">
            <span>Warning!</span>
            <span>
              This task overwrites databases. Be careful to double check the source and destination environment!
            </span>
          </div>
        </div>

        <label id="source-env">Source:</label>

        <SelectWithOptions
          data-cy="source-env"
          placeholder="Select source environment..."
          aria-labelledby="source-env"
          aria-required
          onValueChange={envId => setSelectedSourceEnv(Number(envId))}
          options={options}
          defaultOpen={false}
        />

        <label id="dest-env">Destination:</label>

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

        <Button className="max-w-max" data-cy="task-btn" onClick={handleTask} disabled={!selectedSourceEnv || loading}>
          {loading && <Loader2 className="animate-spin" />} Run task
        </Button>
      </div>
    </>
  );
};

export default DrushSqlSync;
