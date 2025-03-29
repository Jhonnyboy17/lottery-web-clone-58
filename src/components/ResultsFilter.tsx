
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ResultsFilterProps {
  gameType: string;
  onGameTypeChange: (value: string) => void;
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({
  gameType,
  onGameTypeChange,
  timeframe,
  onTimeframeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Jogo
        </label>
        <Select value={gameType} onValueChange={onGameTypeChange}>
          <SelectTrigger className="w-full bg-purple-800 border-purple-700 text-white">
            <SelectValue placeholder="Selecione o jogo" />
          </SelectTrigger>
          <SelectContent className="bg-purple-800 border-purple-700 text-white">
            <SelectItem value="all">Todos os Jogos</SelectItem>
            <SelectItem value="mega-sena">Mega-Sena</SelectItem>
            <SelectItem value="quina">Quina</SelectItem>
            <SelectItem value="lotofacil">Lotofácil</SelectItem>
            <SelectItem value="lotomania">Lotomania</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Período
        </label>
        <Select value={timeframe} onValueChange={onTimeframeChange}>
          <SelectTrigger className="w-full bg-purple-800 border-purple-700 text-white">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent className="bg-purple-800 border-purple-700 text-white">
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="last-week">Última Semana</SelectItem>
            <SelectItem value="last-month">Último Mês</SelectItem>
            <SelectItem value="last-year">Último Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsFilter;
