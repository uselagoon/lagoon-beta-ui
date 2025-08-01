'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@uselagoon/ui-library';

export const NotFoundGoBack = ({ title }: { title?: string }) => {
  const router = useRouter();
  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        {title ? title : 'This page could not be found'}
      </h1>
      <Button onClick={() => router.back()}>Go Back</Button>
    </>
  );
};
