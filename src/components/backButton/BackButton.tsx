import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  return (
    <div className="mb-5 flex cursor-pointer items-center gap-1" onClick={() => router.back()}>
      <ArrowLeft />
      <span className="text-base leading-[18px] underline">Back</span>
    </div>
  );
};

export default BackButton;
