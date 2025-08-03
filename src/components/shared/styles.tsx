import { ReactNode } from 'react';

export const LinkContentWrapper = ({ children }: { children: ReactNode }) => {
  return <section className="px-3">{children}</section>;
};
