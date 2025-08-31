import React, { FC, JSX, useState } from 'react';

import { RoutesWrapper } from '../styles';

interface Props {
  routes: JSX.Element[];
}
const LimitedRoutes: FC<Props> = ({ routes }) => {
  const [expanded, setExpanded] = useState(false);

  const actualRoutes = React.Children.toArray(routes);

  const [firstFiveRoutes, ...otherRoutes] = [actualRoutes.slice(0, 5), ...actualRoutes.slice(5)];
  const leftOverLength = otherRoutes.length;

  const handleExpand = () => setExpanded(true);

  return (
    <RoutesWrapper data-cy="routes">
      {firstFiveRoutes}

      {expanded ? otherRoutes : null}

      {leftOverLength > 0 && !expanded ? (
        <div className="text-[14px] font-normal leading-[14px] cursor-pointer" onClick={handleExpand}>
          Show {leftOverLength} more ...
        </div>
      ) : null}
    </RoutesWrapper>
  );
};

export default LimitedRoutes;
