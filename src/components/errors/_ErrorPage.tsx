'use client';

import { useEffect } from 'react';

import styled from 'styled-components';

const statusCodes = {
  400: 'Bad Request',
  401: 'Not Authenticated',
  404: 'This page could not be found',
  500: 'Internal Server Error',
  501: 'Not Implemented',
};

type StatusCode = keyof typeof statusCodes;

interface Props {
  statusCode: StatusCode;
  errorMessage: string;
  title?: string;
}

/**
 * Displays an error page, given a status code and optional error message.
 */

const ErrorPage = ({ statusCode, errorMessage, title }: Props) => {
  const ErorrTitle = title || statusCodes[statusCode] || 'An unexpected error has occurred';

  useEffect(() => {
    document.title = `${statusCode}: ${ErorrTitle}`;
  }, [ErorrTitle]);

  return (
    <section
      className={`
    fixed top-[76px] left-0 
    w-screen h-screen 
    flex flex-col items-center gap-8 
    pt-[10%] 
    bg-white dark:bg-black
  `}
    >
      <h2 className="text-2xl">{ErorrTitle}</h2>
      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
};
export default ErrorPage;
