import { FC } from 'react';

import Image from 'next/image';

import getKeyFactImage from '@/constants/keyFactImageMap';

import { KeyFact } from './KeyFacts';

const spanBase = 'text-[12px] font-normal tracking-[-0.24px]';

const FactCard: FC<KeyFact> = ({ name, category, value }) => {
  const image = getKeyFactImage(name);

  return (
    <div className="border border-[#333] flex flex-col rounded-[6px] w-[8.125rem] min-h-[6.25rem] p-[5px]">
      <span className={`${spanBase} uppercase leading-[22px] mb-[3px]`}>{category}</span>
      <Image className="img mx-auto mb-2 mt-auto" width={49} height={49} src={image} alt="keyfact image" />
      <span className={`${spanBase} normal-case leading-[11px] text-right mb-[2px]`}>{name}</span>
      <span className={`${spanBase} normal-case leading-[11px] text-right mb-[2px]`}>{value}</span>
    </div>
  );
};

export default FactCard;
