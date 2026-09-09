import React from 'react';

import ErrorPage from './_ErrorPage';

export default ({ kubernetesNamespaceName }: { kubernetesNamespaceName: string }) => (
  <ErrorPage statusCode={404} errorMessage={`Environment "${kubernetesNamespaceName}" not found`} />
);
