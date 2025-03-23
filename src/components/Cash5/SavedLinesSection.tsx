
import React from "react";
import SavedLines from "./SavedLines";
import { NumberSelectionType } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SavedLinesSectionProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
  extraPlayName: string;
  onToggleExtraPlay?: (index: number, checked: boolean) => void;
  onChangeDrawCount?: (index: number, count: string) => void;
}

const SavedLinesSection: React.FC<SavedLinesSectionProps> = ({
  savedLines,
  onRemoveLine,
  onEditLine,
  extraPlayName,
  onToggleExtraPlay,
  onChangeDrawCount
}) => {
  return (
    <div className="bg-gray-50 p-4">
      <h3 className="font-semibold mb-3">Minhas Linhas</h3>
      
      {savedLines.length === 0 ? (
        <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>
      ) : (
        savedLines.map((line, index) => (
          <div key={index} className="mb-4">
            <div 
              className="bg-white rounded p-3 mb-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onEditLine(index)}
            >
              <div className="flex items-center">
                {line.digits.map((digit, i) => (
                  digit !== null && (
                    <span 
                      key={i} 
                      className="text-white rounded-full w-7 h-7 flex items-center justify-center text-sm mx-0.5 bg-amber-500"
                    >
                      {digit === -1 ? "X" : digit}
                    </span>
                  )
                ))}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLine(index);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-100 rounded p-2 pl-3 flex flex-col gap-2 text-sm">
              {onToggleExtraPlay && (
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`extraplay-${index}`} 
                    checked={line.includeFireball}
                    onCheckedChange={(checked) => onToggleExtraPlay(index, checked as boolean)} 
                  />
                  <label htmlFor={`extraplay-${index}`} className="text-sm font-medium">
                    Adicionar {extraPlayName}
                  </label>
                </div>
              )}
              
              {onChangeDrawCount && (
                <div className="flex items-center gap-2 mt-1">
                  <label className="text-sm font-medium">Sorteios:</label>
                  <Select 
                    value={line.drawCount || "1"} 
                    onValueChange={(value) => onChangeDrawCount(index, value)}
                  >
                    <SelectTrigger className="w-32 h-7 text-sm">
                      <SelectValue placeholder="Sorteios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 sorteio</SelectItem>
                      <SelectItem value="2">2 sorteios</SelectItem>
                      <SelectItem value="3">3 sorteios</SelectItem>
                      <SelectItem value="4">4 sorteios</SelectItem>
                      <SelectItem value="5">5 sorteios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedLinesSection;
