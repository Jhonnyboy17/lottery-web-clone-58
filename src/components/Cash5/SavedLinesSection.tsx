
import React from "react";
import SavedLines from "./SavedLines";
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
}

const SavedLinesSection: React.FC<SavedLinesSectionProps> = ({
  savedLines,
  onRemoveLine,
  onEditLine,
  editingIndex,
  onStartNewLine
}) => {
  return (
    <div className="bg-gray-50 p-4">
      <h3 className="font-semibold mb-3">Minhas Linhas</h3>
      
      {savedLines.length === 0 ? (
        <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>
      ) : (
        <>
          {savedLines.map((line, index) => (
            <div key={index} className={`mb-2 ${editingIndex === index ? 'bg-blue-50' : 'bg-white'}`}>
              <div 
                className={`rounded p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                  editingIndex === index ? 'bg-blue-50' : 'bg-white'
                }`}
                onClick={() => onEditLine(index)}
              >
                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-6 mr-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {line.digits.map((digit, i) => (
                    <span 
                      key={i} 
                      className={`rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5 ${
                        digit === null ? 'bg-white border border-gray-200 text-gray-500' : 
                        digit === -1 ? 'bg-red-500 text-white' : 
                        'bg-blue-500 text-white'
                      }`}
                    >
                      {digit === null ? '?' : digit === -1 ? <span className="font-bold">x</span> : digit}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLine(index);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty template line - always shown as the next line and clickable */}
          <div className="mb-2">
            <div 
              className="bg-blue-50 rounded p-3 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors border border-gray-200"
              onClick={onStartNewLine}
            >
              <div className="flex items-center">
                <span className="text-gray-500 font-medium w-6 mr-2">
                  {String(savedLines.length + 1).padStart(2, '0')}
                </span>
                {Array(5).fill(null).map((_, i) => (
                  <span 
                    key={i} 
                    className="bg-white border border-gray-200 text-gray-500 rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5"
                  >
                    ?
                  </span>
                ))}
              </div>
              <div className="w-4"></div> {/* Empty space where the X button would be */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedLinesSection;
