
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { NumberSelectionType } from "./types";
import NumberSelection from "./NumberSelection";
import PlayTypeSelector from "./PlayTypeSelector";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface CurrentLineSelectionProps {
  lineCount: number;
  currentLine: NumberSelectionType;
  activeDigitIndex: number | null;
  setActiveDigitIndex: (index: number | null) => void;
  playTypes: string[];
  betAmounts: string[];
  onQuickPick: () => void;
  onPlayTypeChange: (type: string) => void;
  onBetAmountChange: (amount: string) => void;
  onDigitSelect: (digit: number) => void;
  isLineComplete: boolean;
  onClearSelections: () => void;
  onAddLine: () => void;
  colorValue: string;
}

const CurrentLineSelection: React.FC<CurrentLineSelectionProps> = ({
  lineCount,
  currentLine,
  activeDigitIndex,
  setActiveDigitIndex,
  playTypes,
  betAmounts,
  onQuickPick,
  onPlayTypeChange,
  onBetAmountChange,
  onDigitSelect,
  isLineComplete,
  onClearSelections,
  onAddLine,
  colorValue,
}) => {
  const isPairSelection = currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair";
  
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Linha {String(lineCount).padStart(2, "0")}</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600"
          onClick={onQuickPick}
        >
          <RefreshCw size={16} className="mr-1" />
          QUICK PICK
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Jogo</label>
          <PlayTypeSelector 
            playTypes={playTypes} 
            selectedPlayType={currentLine.playType} 
            onPlayTypeChange={onPlayTypeChange} 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">por</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
              >
                {currentLine.betAmount}
                <span className="ml-1">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {betAmounts.map((amount) => (
                <DropdownMenuItem
                  key={amount}
                  onClick={() => onBetAmountChange(amount)}
                >
                  {amount}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Jogada</label>
          <p className="h-10 flex items-center justify-center font-bold text-green-700">
            R${isLineComplete ? "1.00" : "0.00"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            {isPairSelection 
              ? "O primeiro dígito é marcado com X. Selecione os outros dois números." 
              : "Escolha seu primeiro dígito para começar!"}
          </p>
          <button
            className="text-xs text-gray-500 underline"
            onClick={onClearSelections}
          >
            Limpar seleção
          </button>
        </div>

        <NumberSelection
          selectedDigits={currentLine.digits}
          activeDigitIndex={activeDigitIndex}
          onDigitSelect={setActiveDigitIndex}
          colorValue={colorValue}
          isPairSelection={isPairSelection}
        />
      </div>

      <div className="flex justify-center">
        <Button
          disabled={!isLineComplete}
          className={`w-full max-w-xs ${
            isLineComplete ? `bg-[${colorValue}] hover:bg-[${colorValue}]/90` : "bg-gray-300"
          }`}
          onClick={onAddLine}
        >
          Adicionar à Aposta {lineCount > 1 ? lineCount : ""}
        </Button>
      </div>
    </div>
  );
};

export default CurrentLineSelection;
