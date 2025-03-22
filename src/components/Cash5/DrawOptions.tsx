
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, SunMoon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DrawOptionsProps {
  selectedDrawTime: string;
  selectedDrawCount: string;
  onDrawTimeChange: (value: string) => void;
  onDrawCountChange: (value: string) => void;
}

const DrawOptions: React.FC<DrawOptionsProps> = ({
  selectedDrawTime,
  selectedDrawCount,
  onDrawTimeChange,
  onDrawCountChange,
}) => {
  return (
    <div className="space-y-4 mb-4 w-full">
      <div className="border border-gray-200 rounded-md p-4">
        <p className="font-medium text-sm mb-3">Selecione o horário do sorteio:</p>
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <Button
            variant={selectedDrawTime === "both" ? "default" : "outline"}
            className={`flex-1 px-6 ${selectedDrawTime === "both" ? "bg-blue-500" : ""}`}
            onClick={() => onDrawTimeChange("both")}
          >
            <SunMoon className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Ambos sorteios</span>
          </Button>
          <Button
            variant={selectedDrawTime === "midday" ? "default" : "outline"}
            className={`flex-1 px-6 ${selectedDrawTime === "midday" ? "bg-blue-500" : ""}`}
            onClick={() => onDrawTimeChange("midday")}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Sorteio diurno</span>
          </Button>
          <Button
            variant={selectedDrawTime === "evening" ? "default" : "outline"}
            className={`flex-1 px-6 ${selectedDrawTime === "evening" ? "bg-blue-500" : ""}`}
            onClick={() => onDrawTimeChange("evening")}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Sorteio noturno</span>
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4">
        <p className="font-medium text-sm mb-3">Por quantos sorteios?</p>
        <Select value={selectedDrawCount} onValueChange={onDrawCountChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o número de sorteios" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="1">1 sorteio</SelectItem>
            <SelectItem value="2">2 sorteios</SelectItem>
            <SelectItem value="4">4 sorteios</SelectItem>
            <SelectItem value="6">6 sorteios</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DrawOptions;
