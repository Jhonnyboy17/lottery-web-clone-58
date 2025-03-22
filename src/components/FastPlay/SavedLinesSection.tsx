
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import SavedLines from "./SavedLines";
import { Label } from "@/components/ui/label";
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
  setIncludeFireball,
}) => {
  if (savedLines.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Suas jogadas</h3>
      <SavedLines savedLines={savedLines} onRemoveLine={onRemoveLine} />
      <div className="mt-6 flex items-start gap-2">
        <Checkbox
          id="extraPlay"
          checked={includeFireball}
          onCheckedChange={() => setIncludeFireball(!includeFireball)}
          className="mt-1"
        />
        <div>
          <Label htmlFor="extraPlay" className="font-medium">Adicionar {extraPlayName}</Label>
          <p className="text-sm text-gray-600">
            Por +R$1,00, você pode adicionar {extraPlayName} à sua jogada e ganhar ainda mais chances!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedLinesSection;
