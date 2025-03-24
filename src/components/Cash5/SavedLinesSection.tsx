
import React from "react";
import SavedLines from "./SavedLines";
import { NumberSelectionType } from "./types";

interface SavedLinesSectionProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
  extraPlayName: string;
  onToggleExtraPlay?: (index: number, checked: boolean) => void;
  onChangeDrawCount?: (index: number, count: string) => void;
  editingIndex: number | null;
}

const SavedLinesSection: React.FC<SavedLinesSectionProps> = ({
  savedLines,
  onRemoveLine,
  onEditLine,
  editingIndex
}) => {
  return (
    <div className="bg-gray-50 p-4">
      <h3 className="font-semibold mb-3">Minhas Linhas</h3>
      
      {savedLines.length === 0 ? (
        <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>
      ) : (
        savedLines.map((line, index) => (
          <div key={index} className="mb-2">
            <div 
              className="bg-white rounded p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onEditLine(index)}
            >
              <div className="flex items-center">
                <span className="text-gray-500 font-medium w-6 mr-2">
                  {index + 1}
                </span>
                {line.digits.map((digit, i) => (
                  digit !== null && (
                    <span 
                      key={i} 
                      className="text-white rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 bg-amber-500"
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
          </div>
        ))
      )}
    </div>
  );
};

export default SavedLinesSection;
