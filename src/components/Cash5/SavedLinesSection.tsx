
import React from "react";
import SavedLines from "./SavedLines";
import FireballOption from "./FireballOption";
import { NumberSelectionType } from "./types";

interface SavedLinesSectionProps {
  savedLines: NumberSelectionType[];
  onRemoveLine: (index: number) => void;
  extraPlayName: string;
  includeFireball: boolean;
  setIncludeFireball: (value: boolean) => void;
}

const SavedLinesSection: React.FC<SavedLinesSectionProps> = ({
  savedLines,
  onRemoveLine,
  extraPlayName,
  includeFireball,
  setIncludeFireball
}) => {
  return (
    <div className="bg-gray-50 p-4">
      <h3 className="font-semibold mb-3">My Lines</h3>
      
      <SavedLines 
        savedLines={savedLines} 
        onRemoveLine={onRemoveLine} 
      />

      <FireballOption 
        extraPlayName={extraPlayName}
        includeFireball={includeFireball}
        setIncludeFireball={setIncludeFireball}
      />
    </div>
  );
};

export default SavedLinesSection;
