import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Tooltip, TooltipContent, TooltipTrigger } from '@/ui-library';
import { AlertTriangle, CopyX } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import cancelProjectCloneMutation from '@/lib/mutation/organizations/cancelProjectClone';

interface CancelCloneProps {
    cloneID: number;
    onCancel?: () => void;
    orgID: number;
    cloneStatus: string;
    destProject: string;
}

type CancelType = 'cleanup' | 'no-cleanup';

interface CancelOption {
  value: CancelType;
  label: string;
  description: string;
}

const cancelOptions: CancelOption[] = [
  {
    value: 'no-cleanup',
    label: 'Cancel Clone',
    description: 'Leaves the data & resources created by the clone up to the point of cancellation.',
  },
  {
    value: 'cleanup',
    label: 'Cancel Clone with Cleanup',
    description: 'Removes all data & resources created by the clone.',
  },
];

export const CancelClone = (props: CancelCloneProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cleanup, setCleanup] = useState<CancelType>();

    const [cancelProjectClone, { data, loading }] = useMutation(cancelProjectCloneMutation, {
      onCompleted: () => {
        toast.success('Clone cancelled successfully');
      },
      onError: (error) => {
        console.error('Error cancelling clone:', error);
        toast.error('Failed to cancel clone');
      },
    });
    const handleCancel = async () => {
      await cancelProjectClone({
        variables: {
          cloneId: props.cloneID,
          cleanupClone: cleanup === 'cleanup'
        },
      });
      if (props.onCancel) {
        props.onCancel();
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="clone-project" disabled={loading}>
          <CopyX className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Cancel Clone
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-4 w-4 text-sm text-destructive" />
              </TooltipTrigger>
              <TooltipContent>
                <span>Warning: Cancelling the clone may leave resources in an inconsistent state.</span>
              </TooltipContent>
            </Tooltip>
          </DialogTitle>
          <DialogDescription className="mb-2">
              Are you sure you want to cancel the clone process for {props.destProject}? This action cannot be undone.
          </DialogDescription>
          Select a cleanup option:
          <div role="radiogroup" aria-label="Clone cleanup option" className="flex flex-col sm:flex-row justify-evenly gap-4 mt-1.5">
            {cancelOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={cleanup === option.value}
                onClick={() => setCleanup(option.value)}
                className={`flex-1 flex flex-col items-start bg-background gap-2 rounded-xl p-4 text-left border-2 transition-colors ${
                  cleanup === option.value
                    ? 'border-destructive'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <span className={`text-sm font-semibold text-foreground`}>
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">{option.description}</span>
              </button>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleCancel} disabled={loading || !cleanup}>
            Cancel Clone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default CancelClone;