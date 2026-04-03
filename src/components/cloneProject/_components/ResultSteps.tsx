import { FC } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui-library';
import { CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';

export const ProgressStep: FC = () => (
  <>
    <DialogHeader>
      <DialogTitle>Cloning Project</DialogTitle>
      <DialogDescription>Please wait while we create your new project</DialogDescription>
    </DialogHeader>

    <div className="flex flex-col items-center gap-4 py-8">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Creating project...</p>
    </div>

    <DialogFooter>
      <Button disabled>Cloning...</Button>
    </DialogFooter>
  </>
);

interface SuccessStepProps {
  projectName: string;
  clonedProjectName: string;
  selectedOptionsLabels: string[];
  cloneStatus?: string;
  onClose: () => void;
}

export const SuccessStep: FC<SuccessStepProps> = ({ projectName, clonedProjectName, selectedOptionsLabels, cloneStatus, onClose }) => {
  const isComplete = cloneStatus === 'COMPLETE';

  return (
    <>
      <DialogHeader>
        <DialogTitle>Project Cloned</DialogTitle>
        <DialogDescription>
          {isComplete
            ? 'Your new project has been created and deployed successfully'
            : 'Your new project has been created — a deployment is being triggered'}
        </DialogDescription>
      </DialogHeader>
      {selectedOptionsLabels.length > 0 && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <AlertTitle>What will be cloned:</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 space-y-1">
              {selectedOptionsLabels.map(label => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0"
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {cloneStatus && (
        <Alert>
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <AlertTitle>Clone status</AlertTitle>
          <AlertDescription className="text-sm">{cloneStatus}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Next steps</AlertTitle>
        <AlertDescription>
          <ul className="mt-1 space-y-1">
            <li className="text-sm text-muted-foreground">Review the new project settings</li>
            <li className="text-sm text-muted-foreground">Update any project-specific configurations</li>
            <li className="text-sm text-muted-foreground">Deploy to activate the project</li>
          </ul>
        </AlertDescription>
      </Alert>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

interface ErrorStepProps {
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export const ErrorStep: FC<ErrorStepProps> = ({ errorMessage, onRetry, onClose }) => (
  <>
    <DialogHeader>
      <DialogTitle>Cloning Failed</DialogTitle>
      <DialogDescription>Something went wrong while creating your project</DialogDescription>
    </DialogHeader>

    <div className="flex flex-col items-center gap-4 py-4">
      <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />

      {errorMessage && (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button onClick={onRetry}>Try Again</Button>
    </DialogFooter>
  </>
);
