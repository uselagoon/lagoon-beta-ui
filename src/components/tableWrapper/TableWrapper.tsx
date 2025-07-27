import { ReactNode } from 'react';

type WrapperProps = {
  children: ReactNode;
};
const TableWrapper = ({ children }: WrapperProps) => {
  return <section className="py-[24px] px-[28px] rounded-lg border">{children}</section>;
};

export default TableWrapper;
