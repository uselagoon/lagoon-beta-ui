import { ReactNode } from 'react';

export const HighlightedText = ({ children }: { children: ReactNode }) => {
  return <span className="font-medium text-[#3A8CFF]">{children}</span>;
};
