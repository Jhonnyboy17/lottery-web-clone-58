
import React from "react";
import { Trash2, Edit } from "lucide-react";
import { NumberSelectionType } from "./types";

interface SavedLinesProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
  editingIndex?: number | null;
}

const SavedLines: React.FC<SavedLinesProps> = ({ savedLines, onRemoveLine, onEditLine, editingIndex = null }) => {
  if (savedLines.length === 0) {
    return <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>;
  }

  return (
    <>
      {savedLines.map((line, index) => (
        <div key={index} className={`bg-white rounded-md p-3 mb-2 shadow-sm ${editingIndex === index ? 'border-2 border-amber-500' : 'border border-gray-100'}`}>
          <div className="flex items-center justify-between">
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
                    className={`rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 ${
                      digit === null ? 'bg-white border border-gray-200 text-gray-500' : 
                      digit === -1 ? 'bg-red-500 text-white' : 
                      'bg-blue-500 text-white'
                    }`}
                  >
                    {digit === null ? '?' : digit === -1 ? <span className="font-bold">X</span> : digit}
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
        </div>
      ))}
    </>
  );
};

export default SavedLines;
