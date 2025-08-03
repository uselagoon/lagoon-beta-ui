import updateUserSSHPublicKey from '@/lib/mutation/updateUserSSHPublicKey';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { getPK } from './SettingsPage';

interface EditProps {
  name: string;
  id: number;
  keyValue: string;
  keyType: string;
}
export const EditSshSheet = ({ name, id, keyValue, keyType }: EditProps) => {
  const [updateUserSSHPublicKeyMutation, { loading, error }] = useMutation(updateUserSSHPublicKey, {
    refetchQueries: ['Me'],
  });

  const editKey = async (id: number, keyName: string, keyType: string, keyValue: string) => {
    try {
      await updateUserSSHPublicKeyMutation({
        variables: {
          input: {
            id: id,
            patch: {
              name: keyName,
              publicKey: getPK(keyType, keyValue),
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problem updating SSH key', {
        id: 'ssh_error',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <Sheet
      sheetTrigger={<Edit2Icon />}
      sheetTitle="Edit SSH Key"
      sheetFooterButton="Save"
      sheetDescription=""
      loading={loading}
      error={!!error}
      additionalContent={null}
      sheetFields={[
        {
          id: 'key_name',
          label: 'Key Name',
          placeholder: 'Enter a name for the variable',
          required: true,
          inputDefault: name,
        },
        {
          id: 'key_value',
          label: 'Key Value',
          required: true,
          placeholder:
            "Begins with 'ssh-rsa', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521'",
          type: 'textarea',
          inputDefault: keyValue,
        },
      ]}
      buttonAction={(_, { key_name, key_value }) => {
        editKey(id, key_name, keyType, key_value);
      }}
    />
  );
};
