import { FC, useState } from 'react';

import { Input, Skeleton } from '@uselagoon/ui-library';

import { EditDesc } from './EditDesc';
import { EditName } from './EditName';

type DescriptionProps = {
  orgId: number;
  name: string;
  description: string;
  loading?: false;
};
type loadingProps = {
  loading: true;
};

type Props = DescriptionProps | loadingProps;

export const Description: FC<Props> = props => {
  if (props.loading) {
    return (
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
  }

  const { orgId, name, description } = props;

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
        <section className="flex gap-4 items-center">
          <Input defaultValue={description || ' - '} onChange={e => setNewDesc(e.target.value)} />
          {isChangedDesc && <EditDesc orgId={orgId} description={newDesc} />}
        </section>
      </div>
    </>
  );
};
