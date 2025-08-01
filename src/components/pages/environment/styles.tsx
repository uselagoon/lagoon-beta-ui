export const RoutesWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[0.45rem] text-sm [&>a]:no-underline [&>a:hover]:underline">{children}</div>
);
