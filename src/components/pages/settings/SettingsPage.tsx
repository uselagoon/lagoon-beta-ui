'use client';

import { SettingsData } from '@/app/(routegroups)/settings/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import addUserSSHPublicKey from '@/lib/mutation/addUserSSHPublicKey';
import deleteUserSSHPublicKey from '@/lib/mutation/deleteUserSSHPublicKey';
import Me from '@/lib/query/me';
import { ApolloError, QueryRef, useMutation, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, Sheet } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { toast } from 'sonner';

import { renderTableColumns } from './DataTableColumns';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const getPK = (keyType: string, keyValue: string) => {
  return keyType + ' ' + keyValue;
};

const SettingsPage = ({ queryRef }: { queryRef: QueryRef<SettingsData> }) => {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { me },
  } = useReadQuery(queryRef);

  const [deleteUserSSHPublicKeyMutation, { loading: deleteLoading }] = useMutation(deleteUserSSHPublicKey, {
    refetchQueries: ['Me'],
  });

  const [addUserSSHPublicKeyMutation, { loading: addLoading }] = useMutation(addUserSSHPublicKey);

  const deleteKey = async (id: number) => {
    try {
      await deleteUserSSHPublicKeyMutation({
        variables: {
          input: {
            id,
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problem deleting SSH key', {
        id: 'cancel_error',
        description: (err as ApolloError).message,
      });
    }
  };

  const addKey = async (keyName: string, keyValue: string) => {
    try {
      await addUserSSHPublicKeyMutation({
        variables: {
          input: {
            name: keyName,
            publicKey: keyValue,
            user: {
              id: me.id,
              email: me.email,
            },
          },
        },
        refetchQueries: [Me],
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problem adding a new SSH key', {
        id: 'cancel_error',
        description: (err as ApolloError).message,
      });
    }
  };

  const columns = renderTableColumns({ action: deleteKey, loading: deleteLoading });

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">SSH Keys</h3>
        <DataTable columns={columns} data={me.sshKeys} searchableColumns={['name', 'keyType', 'keyFingerprint']} />

        <Sheet
          sheetTrigger="Add New Key"
          sheetTitle="Add a SSH Key"
          sheetFooterButton="Save"
          sheetDescription=""
          loading={addLoading}
          error={false}
          additionalContent={null}
          sheetFields={[
            {
              id: 'key_name',
              label: 'Key Name',
              placeholder: 'Enter a name for the variable',
              required: true,
            },
            {
              id: 'key_value',
              label: 'Key Value',
              required: true,
              placeholder:
                "Begins with 'ssh-rsa', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521'",
              type: 'textarea',
            },
          ]}
          buttonAction={(_, { key_name, key_value }) => {
            addKey(key_name, key_value).finally(() => {
              refetch();
            });
          }}
        />
      </SectionWrapper>
    </>
  );
};

export default SettingsPage;
