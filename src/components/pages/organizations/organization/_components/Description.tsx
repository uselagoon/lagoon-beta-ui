import { FC, useState } from 'react';

// import { LoadingSkeleton } from '@uselagoon/ui-library';

// import { EditDesc } from './EditDesc';
// import { EditName } from './EditName';
import {Input} from "@uselagoon/ui-library";

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
          <span>organization name</span>
          <section>
            <span>
              {/*<LoadingSkeleton width={100} />*/}
            </span>
          </section>
        </div>

        <div className="flex flex-col gap-1 mb-3.5 mt-6">
          <span>description</span>
          <section>
            <span>
              {/*<LoadingSkeleton width={100} />*/}
            </span>
          </section>
        </div>
      </>
    );
  }

  const { orgId, name, description } = props;

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false);

  const closeNameModal = () => {
    setNameModalOpen(false);
  };

  const closeDescModal = () => {
    setDescModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-1 mb-3.5 mt-6">
        <span>Organization Name</span>
        <section>
          <Input label='' value={name} />
        </section>
      </div>

      <div className="flex flex-col gap-1 mb-3.5 mt-6">
        <span>Organization Description</span>
        <section>
          <Input label='' value={description || ' - '} />
        </section>
      </div>
    </>
  );
};
