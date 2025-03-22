
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PlayTypeSelectorProps {
  playTypes: string[];
  selectedPlayType: string;
  onPlayTypeChange: (type: string) => void;
}

const PlayTypeSelector: React.FC<PlayTypeSelectorProps> = ({
  playTypes,
  selectedPlayType,
  onPlayTypeChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between border-gray-300">
          {selectedPlayType}
          <span className="ml-1">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {playTypes.map((type) => (
          <DropdownMenuItem key={type} onClick={() => onPlayTypeChange(type)}>
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlayTypeSelector;
