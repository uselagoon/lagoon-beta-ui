import { FC } from 'react';

import { keyFactImageType } from '@/constants/keyFactImageMap';
import { Skeleton } from '@uselagoon/ui-library';

import FactCard from './FactCard';

export type KeyFact = { name: keyFactImageType; category: string; value: string; id: number };

type FactsProps = {
  keyFacts: KeyFact[];
  loading?: false;
};

type Loading = {
  loading: true;
  keyFacts?: undefined;
};

type Props = Loading | FactsProps;

const KeyFacts: FC<Props> = ({ keyFacts, loading }) => {
  return (
    <div className="flex flex-col w-full my-8">
      <section className="w-full grid [grid-template-columns:repeat(auto-fit,_8.125rem)] grid-rows-auto gap-[0.8rem]">
        {loading ? (
          <>
            <Skeleton className="w-[130px] h-24" />
            <Skeleton className="w-[130px] h-24" />
            <Skeleton className="w-[130px] h-24" />
          </>
        ) : (
          keyFacts.map(fact => {
            return <FactCard key={fact.id} {...fact} />;
          })
        )}
      </section>
    </div>
  );
};

export default KeyFacts;
