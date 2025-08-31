import { FC, useState } from 'react';

import {Input, Skeleton, Textarea} from '@uselagoon/ui-library';

import { EditDesc } from './EditDesc';
import { EditName } from './EditName';

type DescriptionProps = {
  orgId: number;
  name: string;
  description: string;
};

type LoadingProps = {
  loading: true;
};

type Props = DescriptionProps | LoadingProps;

const DescriptionLoading: FC = () => (
  <>
    <div className="flex flex-col gap-1 mb-3.5 mt-6">
      <span>Organization Name</span>
      <section>
        <span>
          <Skeleton className="h-10 w-[300px]" />
        </span>
      </section>
    </div>

    <div className="flex flex-col gap-1 mb-3.5 mt-6">
      <span>Organization Description</span>
      <section>
        <span>
          <Skeleton className="h-10 w-[300px]" />
        </span>
      </section>
    </div>
  </>
);

const DescriptionData: FC<DescriptionProps> = ({ orgId, name, description }) => {
  const [newName, setNewName] = useState(name);
  const [newDesc, setNewDesc] = useState(description || '');

  const isChangedName = newName !== name;
  const isChangedDesc = newDesc !== (description || '');

  return (
    <>
      <div className="flex flex-col gap-1 mb-3.5 mt-6">
        <span>Organization Name</span>
        <section className="flex gap-4 items-center">
          <Input defaultValue={name} onChange={e => setNewName(e.target.value)} />
          {isChangedName && <EditName orgId={orgId} friendlyName={newName} />}
        </section>
      </div>

      <div className="flex flex-col gap-1 mb-3.5 mt-6">
        <span>Organization Description</span>
        <section className="flex gap-4 items-center w-1/2">
          <Textarea defaultValue={description || ' - '} onChange={e => setNewDesc(e.target.value)} />
          {isChangedDesc && <EditDesc orgId={orgId} description={newDesc} />}
        </section>
      </div>
    </>
  );
};

export const Description: FC<Props> = props => {
  if ('loading' in props && props.loading) {
    return <DescriptionLoading />;
  }

  return <DescriptionData {...(props as DescriptionProps)} />;
};
