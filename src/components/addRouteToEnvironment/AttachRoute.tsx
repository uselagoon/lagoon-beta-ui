import { FC } from 'react';

import AttachRouteSheet from './AttachRouteSheet';
import { ProjectEnvironment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';

type Props = {
  variant?: 'default' | 'small';
  projectName?: string;
  domainName?: string;
  environments: ProjectEnvironment[];
  refetch?: () => void;
  iconOnly?: boolean;
  prodEnvironment?: string;
  standbyEnvironment?: string;
};

export const AttachRoute: FC<Props> = props => {

  return (
    <>
      <div className="flex gap-2 items-center">
        <AttachRouteSheet
          projectName={props.projectName}
          domainName={props.domainName}
          environments={props.environments}
          iconOnly={props.iconOnly}
          prodEnvironment={props.prodEnvironment}
          standbyEnvironment={props.standbyEnvironment}
        />
      </div>
    </>
  );
};
