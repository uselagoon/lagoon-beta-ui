import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-library';
import { CopyX } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import cancelProjectCloneMutation from '@/lib/mutation/organizations/cancelProjectClone';

interface CancelCloneProps {
    cloneID: number;
    onCancel?: () => void;
    orgID: number;
    destProject: string;
}

export const CancelClone = (props: CancelCloneProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
          organization: props.orgID,
          cloneId: props.cloneID,
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
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Clone</DialogTitle>
          <DialogDescription>
              Are you sure you want to cancel the clone process for {props.destProject}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
              Cancel Clone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default CancelClone;