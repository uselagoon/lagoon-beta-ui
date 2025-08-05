'use client';

import { AppProgressProvider } from '@bprogress/next';

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProgressProvider height="2px" color="#497ffa" options={{ showSpinner: false }} shallowRouting>
      {children}
    </AppProgressProvider>
  );
};

export default ProgressProvider;
