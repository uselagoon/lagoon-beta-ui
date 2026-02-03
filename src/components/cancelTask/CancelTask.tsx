import { Task } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import cancelTask from '@/lib/mutation/cancelTask';
import { useMutation } from '@apollo/client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

interface CancelButtonProps {
  action: () => Promise<any>;
  success: boolean;
  loading: boolean;
  error?: {
    message: string;
  };
  beforeText?: string;
  afterText?: string;
}

export const CancelTaskButton = ({ action, success, loading, error, beforeText, afterText }: CancelButtonProps) => {
  if (error) toast.error('There was a problem cancelling a task', { description: error?.message });

  return (
    <>
      {!success && (
        <Tooltip>
          <TooltipContent>Cancel Task</TooltipContent>
          <TooltipTrigger disabled={loading || success} onClick={action} aria-label="cancel-task">
            <Ban data-cy="cancel-task" />
          </TooltipTrigger>
        </Tooltip>
      )}

      {success ? afterText || 'Cancelled' : beforeText || ''}
    </>
  );
};

const CancelTask = ({
  task,
  environmentId,
  projectId,
  beforeText,
  afterText,
}: {
  task: Partial<Task>;
  environmentId: number;
  projectId: number;
  beforeText?: string;
  afterText?: string;
}) => {
  const [cancelTaskMutation, { data, loading, error }] = useMutation(cancelTask, {
    onError: err => {
      console.error(err);
    },
    variables: {
      taskId: task.id,
      taskName: task.taskName,
      environmentId,
      projectId,
    },
    refetchQueries: ['getEnvironment'],
  });

  return (
    <CancelTaskButton
      action={cancelTaskMutation}
      success={data && data.cancelDeployment === 'success'}
      loading={loading}
      error={error}
      beforeText={beforeText}
      afterText={afterText}
    />
  );
};

export default CancelTask;
