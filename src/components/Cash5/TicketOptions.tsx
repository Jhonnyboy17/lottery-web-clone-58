
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { NumberSelectionType } from "./types";

interface TicketOptionsProps {
  lineCount: number;
  currentLine: NumberSelectionType;
  playTypes: string[];
  betAmounts: string[];
  onQuickPick: () => void;
  onPlayTypeChange: (value: string) => void;
  onBetAmountChange: (value: string) => void;
}

const TicketOptions: React.FC<TicketOptionsProps> = ({
  lineCount,
  currentLine,
  playTypes,
  betAmounts,
  onQuickPick,
  onPlayTypeChange,
  onBetAmountChange
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Line {String(lineCount).padStart(2, '0')}</h3>
        <Button 
          onClick={onQuickPick}
          className="text-xs h-8 bg-white border hover:bg-opacity-10 rounded-full"
          style={{ color: "#0EA5E9", borderColor: "#0EA5E9" }}
        >
          QUICK PICK
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Play</span>
          <Select value={currentLine.playType} onValueChange={onPlayTypeChange}>
            <SelectTrigger className="w-32 border-b border-t-0 border-l-0 border-r-0 rounded-none h-8 focus:ring-0">
              <SelectValue placeholder="Select play type" />
            </SelectTrigger>
            <SelectContent>
              {playTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500">for</span>
          <Select value={currentLine.betAmount} onValueChange={onBetAmountChange}>
            <SelectTrigger className="w-24 border-b border-t-0 border-l-0 border-r-0 rounded-none h-8 focus:ring-0">
              <SelectValue placeholder="Amount" />
            </SelectTrigger>
            <SelectContent>
              {betAmounts.map((amount) => (
                <SelectItem key={amount} value={amount}>{amount}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default TicketOptions;
