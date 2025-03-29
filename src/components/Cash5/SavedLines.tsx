
import React from "react";
import { Trash2, Edit } from "lucide-react";
import { NumberSelectionType } from "./types";

interface SavedLinesProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
  editingIndex?: number | null;
  currentLine?: NumberSelectionType;
}

const SavedLines: React.FC<SavedLinesProps> = ({ 
  savedLines, 
  onRemoveLine, 
  onEditLine, 
  editingIndex = null, 
  currentLine 
}) => {
  // Always show something, even if there are no saved lines
  const showEmptyMessage = savedLines.length === 0 && !currentLine;

  return (
    <div className="space-y-2">
      {showEmptyMessage && (
        <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>
      )}

      {savedLines.map((line, index) => (
        <div key={index} className={`bg-white dark:bg-gray-800 rounded-md p-3 mb-2 shadow-sm ${
          editingIndex === index 
            ? 'border-2 border-amber-500 dark:border-purple-400 dark:bg-purple-900/60' 
            : 'border border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 dark:text-gray-400 font-medium w-6">
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
                      digit === null ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold' : 
                      digit === -1 ? 'bg-red-500 text-white' : 
                      'bg-blue-500 text-white'
                    }`}
                  >
                    {digit === null ? '?' : digit === -1 ? <span className="font-bold">X</span> : digit}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <div>{line.playType}</div>
                <div>{line.betAmount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEditLine(index)}
                className="text-blue-500 hover:text-blue-700 dark:text-purple-400 dark:hover:text-purple-300"
                title="Editar linha"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onRemoveLine(index)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Remover linha"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Always show the current line template - guaranteed to display */}
      <div className="bg-white dark:bg-gray-800 rounded p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 mb-2">
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium w-6 mr-2">
            {String(savedLines.length + 1).padStart(2, '0')}
          </span>
          {Array(currentLine?.digits.length || 5).fill(null).map((_, i) => (
            <span 
              key={i} 
              className="rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold"
            >
              {currentLine && i < currentLine.digits.length && currentLine.digits[i] !== null ? (
                <span className="bg-blue-500 text-white w-full h-full rounded-full flex items-center justify-center">
                  {currentLine.digits[i] === -1 ? <span className="font-bold">X</span> : currentLine.digits[i]}
                </span>
              ) : '?'}
            </span>
          ))}
        </div>
        <div className="w-4"></div>
      </div>
    </div>
  );
};

export default SavedLines;
