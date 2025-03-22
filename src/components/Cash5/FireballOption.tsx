
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FireballOptionProps {
  extraPlayName: string;
  includeFireball: boolean;
  setIncludeFireball: (value: boolean) => void;
}

const FireballOption: React.FC<FireballOptionProps> = ({
  extraPlayName,
  includeFireball,
  setIncludeFireball
}) => {
  return (
    <div className="mt-6 border border-amber-300 rounded-md bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold">plus</span>
          <span className="font-bold text-orange-500">{extraPlayName}</span>
          <span role="img" aria-label="fire">🔥</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-2">Add plus {extraPlayName} for more ways to win!</p>
        <p className="text-xs text-gray-600">
          If you want to plus up your wager, try plus {extraPlayName}! The {extraPlayName.replace("™", "")} number gives players another chance to win on their same numbers.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Checkbox 
          id="fireball" 
          checked={includeFireball}
          onCheckedChange={(checked) => setIncludeFireball(checked as boolean)} 
        />
      </div>
    </div>
  );
};

export default FireballOption;
