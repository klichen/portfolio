'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlayerSelectProps {
  players: string[];
  selectedPlayer: string;
  onPlayerChange: (player: string) => void;
}

export function PlayerSelect({
  players,
  selectedPlayer,
  onPlayerChange,
}: PlayerSelectProps) {
  return (
    <div className="flex-1">
      <Select value={selectedPlayer} onValueChange={onPlayerChange}>
        <SelectTrigger className="w-full border-2 border-primary">
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">PLAYER</span>
            <span className="text-xl">
              <SelectValue />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {players.map((player) => (
            <SelectItem key={player} value={player} className="p-5 text-lg">
              {player}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
