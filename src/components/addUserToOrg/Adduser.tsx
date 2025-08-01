import { FC } from 'react';

import { orgUserRoleOptions } from '../shared/selectOptions';
import AddUserSheet from "@/components/addUserToOrg/AddUserSheet";

type WithOptions = {
  type: 'multiple';
  groupOptions: {
    label: string;
    value: string;
  }[];
};

type WithGroupName = {
  type: 'single';
  groupName: string;
};

type Props = {
  variant?: 'default' | 'small';
  refetch?: () => void;
  iconOnly?: boolean;
  type: 'multiple' | 'single';
} & (WithGroupName | WithOptions);

export const AddUser: FC<Props> = props => {

  const groupSelectOptions =
    props.type === 'multiple'
      ? props.groupOptions
      : [
          {
            label: props.groupName,
            value: props.groupName,
          },
        ];

  return (
    <>
      <div className="flex gap-2 items-center">
        {!props.iconOnly && <span className="text">Add a user to a group</span>}
        <AddUserSheet
          groupSelectOptions={groupSelectOptions}
          orgUserRoleOptions={orgUserRoleOptions}
          iconOnly={props.iconOnly}
          type={props.type}
        />
      </div>

    </>
  );
};
