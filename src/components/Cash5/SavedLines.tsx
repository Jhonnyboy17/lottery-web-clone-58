
import React from "react";
import { Trash2, Edit } from "lucide-react";
import { NumberSelectionType } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavedLinesProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
}

const SavedLines: React.FC<SavedLinesProps> = ({ savedLines, onRemoveLine, onEditLine }) => {
  if (savedLines.length === 0) {
    return <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>;
  }

  return (
    <>
      {savedLines.map((line, index) => (
        <div key={index} className="bg-white rounded-md p-3 mb-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium w-6">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div 
                className="flex cursor-pointer" 
                onClick={() => onEditLine(index)}
              >
                {line.digits.map((digit, i) => (
                  <span 
                    key={i} 
                    className="text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-0.5 bg-blue-500"
                  >
                    {digit === -1 ? "X" : digit}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-600">
                <div>{line.playType}</div>
                <div>{line.betAmount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEditLine(index)}
                className="text-blue-500 hover:text-blue-700"
                title="Editar linha"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onRemoveLine(index)}
                className="text-gray-400 hover:text-gray-600"
                title="Remover linha"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Options per line */}
          <div className="border-t pt-2 mt-2">
            <div className="flex flex-col space-y-2">
              {/* Fireball option */}
              <div className="flex items-center justify-between">
                <label htmlFor={`fireball-${index}`} className="text-xs font-medium flex items-center">
                  <span role="img" aria-label="fire" className="mr-1">🔥</span>
                  Incluir Fireball
                </label>
                <Checkbox 
                  id={`fireball-${index}`} 
                  checked={line.includeFireball}
                  onCheckedChange={(checked) => {
                    line.includeFireball = checked as boolean;
                    // Force re-render
                    onEditLine(index);
                    onEditLine(-1); // Use invalid index to force update without actual edit
                  }}
                />
              </div>
              
              {/* Draw count per line */}
              <div className="flex items-center justify-between">
                <label htmlFor={`draws-${index}`} className="text-xs font-medium">
                  Número de sorteios:
                </label>
                <Select 
                  value={line.drawCount || "1"} 
                  onValueChange={(value) => {
                    line.drawCount = value;
                    // Force re-render
                    onEditLine(index);
                    onEditLine(-1); // Use invalid index to force update without actual edit
                  }}
                >
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 sorteio</SelectItem>
                    <SelectItem value="2">2 sorteios</SelectItem>
                    <SelectItem value="4">4 sorteios</SelectItem>
                    <SelectItem value="6">6 sorteios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Line price */}
              <div className="flex justify-end">
                <span className="text-sm font-semibold">
                  R$ {calculateLinePrice(line)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Helper function to calculate price for a single line
const calculateLinePrice = (line: NumberSelectionType): string => {
  const baseAmount = parseFloat(line.betAmount.replace('R$', ''));
  const fireballAmount = line.includeFireball ? 1 : 0;
  const drawCount = parseInt(line.drawCount || "1");
  
  const total = (baseAmount + fireballAmount) * drawCount;
  return total.toFixed(2);
};

export default SavedLines;
