
import React from "react";
import { NumberSelectionType } from "./types";
import { X } from "lucide-react";

interface SavedLinesSectionProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  onEditLine: (index: number) => void;
  extraPlayName: string;
  onToggleExtraPlay?: (index: number, checked: boolean) => void;
  onChangeDrawCount?: (index: number, count: string) => void;
  editingIndex: number | null;
  onStartNewLine?: () => void;
  currentLine?: NumberSelectionType | null;
}

const SavedLinesSection: React.FC<SavedLinesSectionProps> = ({
  savedLines,
  onRemoveLine,
  onEditLine,
  extraPlayName,
  onToggleExtraPlay,
  onChangeDrawCount,
  editingIndex,
  onStartNewLine,
  currentLine
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4">
      <h3 className="font-semibold mb-3 dark:text-white">Minhas Linhas</h3>
      
      {savedLines.length === 0 ? (
        // Display a template line with question marks
        <div className="mb-2">
          <div 
            className="rounded p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
            onClick={onStartNewLine}
          >
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium w-6 mr-2">
                01
              </span>
              {Array(3).fill(null).map((_, i) => (
                <span 
                  key={i} 
                  className="border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 bg-white dark:bg-gray-800"
                >
                  ?
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {savedLines.map((line, index) => (
            <div key={index} className="mb-2">
              <div 
                className={`rounded p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  editingIndex === index 
                    ? 'bg-blue-50 dark:bg-gray-800 dark:border dark:border-purple-400' 
                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => onEditLine(index)}
              >
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium w-6 mr-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLine(index);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      
      {/* Show the new line template only when not editing */}
      {editingIndex === null && (
        <div className="mb-2">
          <div 
            className="rounded p-3 flex items-center justify-between cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onStartNewLine}
          >
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium w-6 mr-2">
                {String(savedLines.length + 1).padStart(2, '0')}
              </span>
              {Array(3).fill(null).map((_, i) => (
                <span 
                  key={i} 
                  className="border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 bg-white dark:bg-gray-800"
                >
                  {currentLine && i < currentLine.digits.length && currentLine.digits[i] !== null ? (
                    <span 
                      className={`w-full h-full rounded-full flex items-center justify-center ${
                        currentLine.digits[i] === -1 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      {currentLine.digits[i] === -1 ? <span className="font-bold">X</span> : currentLine.digits[i]}
                    </span>
                  ) : '?'}
                </span>
              ))}
            </div>
            <div className="w-4"></div> {/* Empty space where the X button would be */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedLinesSection;
