import { ReactNode } from 'react';

type WrapperProps = {
  children: ReactNode;
};
const SectionWrapper = ({ children }: WrapperProps) => {
  return <section className="py-[16px] px-[18px] rounded-lg border">{children}</section>;
};

export default SectionWrapper;
