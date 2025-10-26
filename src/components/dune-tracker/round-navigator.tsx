'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoundNavigatorProps {
  currentRound: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function RoundNavigator({
  currentRound,
  onPrevious,
  onNext,
}: RoundNavigatorProps) {
  return (
    <div className="mt-2 flex items-center gap-4 self-end">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={currentRound === 1}
        className="h-12 w-12 bg-transparent"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous Round</span>
      </Button>

      <Button
        variant="default"
        onClick={onNext}
        disabled={currentRound === 10}
        className="h-12 flex-1 text-lg font-bold"
      >
        NEXT ROUND
        <ChevronRight className="ml-2 h-6 w-6" />
      </Button>
    </div>
  );
}
