/**
 * Layout wrapping AllDeployments page
 */

export default async function ProjectRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
