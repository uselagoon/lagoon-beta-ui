'use client';

import { MouseEvent, useState } from 'react';

import { PreferencesData } from '@/app/(routegroups)/settings/preferences/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import updateUser from '@/lib/mutation/updateUser';
import { QueryRef, useMutation, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Button, Checkbox, Label } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { notificationOptions } from './NotificationOptions';

const PreferencesPage = ({ queryRef }: { queryRef: QueryRef<PreferencesData> }) => {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: {
      me: { email, emailNotifications },
    },
  } = useReadQuery(queryRef);

  type NotificationKeyType = keyof typeof emailNotifications;

  const [notifications, setNotifications] = useState(emailNotifications);

  const [updateUserMutation, { loading: updatingOptIn }] = useMutation(updateUser, {
    variables: {
      email: email,
      sshKeyChanges: notifications.sshKeyChanges,
      groupRoleChanges: notifications.groupRoleChanges,
      organizationRoleChanges: notifications.organizationRoleChanges,
    },
    onCompleted: _ => {
      toast.success('Preferences saved');
      refetch();
    },
    onError: error => {
      toast.error('Update error', {
        id: 'preference_error',
        description: error.message,
      });
    },
  });

  const handleUpdateUser = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateUserMutation();
  };
  const handleCheckboxChange = (key: NotificationKeyType) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email preferences</h3>
      <div className="flex flex-wrap gap-y-4 my-6">
        {notificationOptions.map(option => (
          <div key={option.key} className="basis-6/12 min-w-max mb-4">
            <div className="flex items-start gap-1">
              <Checkbox
                id={option.key}
                label=""
                checked={!!notifications[option.key as NotificationKeyType]}
                onCheckedChange={() => handleCheckboxChange(option.key as NotificationKeyType)}
              />
              <Label htmlFor={option.key} className="flex flex-col items-start">
                <span className="text-lg">{option.title}</span>
                <span className="text-[1rem] text-muted-foreground max-w-[85%]">{option.description}</span>
              </Label>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleUpdateUser} disabled={updatingOptIn}>
        {updatingOptIn && <Loader2 className="animate-spin" />}
        Update Preferences
      </Button>
    </SectionWrapper>
  );
};
export default PreferencesPage;
