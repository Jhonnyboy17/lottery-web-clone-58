
import React from "react";
import { Trash2 } from "lucide-react";
import { NumberSelectionType } from "./types";

interface SavedLinesProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
}

const SavedLines: React.FC<SavedLinesProps> = ({ savedLines, onRemoveLine }) => {
  if (savedLines.length === 0) {
    return <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>;
  }

  return (
    <>
      {savedLines.map((line, index) => (
        <div key={index} className="bg-blue-50 rounded p-2 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium w-6">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex">
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
            <span className="font-semibold">{line.betAmount}</span>
            <button 
              onClick={() => onRemoveLine(index)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default SavedLines;
