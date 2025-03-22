
import React from "react";
import { Trash2 } from "lucide-react";
import { NumberSelectionType } from "./types";
import { X } from "lucide-react";

interface SavedLinesProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
}

const SavedLines: React.FC<SavedLinesProps> = ({ savedLines, onRemoveLine }) => {
  return (
    <div className="space-y-2">
      {savedLines.map((line, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Linha {String(index + 1).padStart(2, "0")}</span>
            <div className="flex gap-2">
              {line.digits.map((digit, i) => {
                // Renderizar X para marcações especiais
                if (digit === "X") {
                  return (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <X size={16} />
                    </div>
                  );
                }
                return (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {digit}
                  </div>
                );
              })}
            </div>
            <span className="text-sm">{line.playType}</span>
            <span className="text-sm">{line.betAmount}</span>
          </div>
          <button 
            onClick={() => onRemoveLine(index)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedLines;
