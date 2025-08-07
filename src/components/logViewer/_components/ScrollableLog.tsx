import { ReactNode, useEffect, useRef, useState } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const ScrollableLog: React.FC<Props> = ({ children }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const logsTopRef = useRef<HTMLDivElement | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const [showButtons, setShowButtons] = useState<boolean>(false);

  useEffect(() => {
    const checkHeight = () => {
      if (parentRef.current && parentRef.current.clientHeight >= 600) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);

    return () => {
      window.removeEventListener('resize', checkHeight);
    };
  }, []);

  const scrollToTop = () => {
    logsTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    logsEndRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  return (
    <div className="relative border-2 rounded-sm" ref={parentRef}>
      {showButtons && (
        <div
          className="absolute right-5 top-5 translate-x-2 rounded-full w-[30px] h-[30px] flex justify-center items-center "
          ref={logsTopRef}
        >
          <ArrowDown className="text-lg cursor-pointer rounded" onClick={scrollToBottom} />
        </div>
      )}

      {children}
      {showButtons && (
        <div
          className="absolute right-5 bottom-5 translate-x-2 rounded-full w-[30px] h-[30px] flex justify-center items-center "
          ref={logsEndRef}
        >
          <ArrowUp className="text-lg cursor-pointer rounded" onClick={scrollToTop} />
        </div>
      )}
    </div>
  );
};

export default ScrollableLog;
