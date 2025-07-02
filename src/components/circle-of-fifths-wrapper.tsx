'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicCircleOfFifths = dynamic(
  () => import('@/components/circle-of-fifths').then(mod => mod.CircleOfFifths),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[440px] w-[440px] rounded-full" />
  }
);

export function CircleOfFifthsWrapper() {
  return <DynamicCircleOfFifths />;
}
