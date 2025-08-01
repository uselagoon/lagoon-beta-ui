'use client';

import { ReactNode } from 'react';

import { Button } from '@uselagoon/ui-library';

export const Client404 = ({ navLink, title }: { navLink: ReactNode; title?: string }) => {
  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        {title ? title : 'This page could not be found'}
      </h1>
      <Button>{navLink}</Button>
    </>
  );
};
