
import React from "react";
import { Button } from "@/components/ui/button";

interface TotalSummaryProps {
  ticketPrice: string;
  colorValue: string;
  hasLines: boolean;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({
  ticketPrice,
  colorValue,
  hasLines
}) => {
  const linesTotalText = hasLines ? '1 line for 1 draw' : '';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-3 px-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <p className="text-sm font-medium mr-2">{linesTotalText}</p>
          {hasLines && (
            <p className="text-xs text-gray-500">Add Power Play?</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xl font-bold">{ticketPrice}</p>
          <Button 
            className="hover:bg-opacity-90 px-6"
            style={{ backgroundColor: colorValue }}
            disabled={!hasLines}
          >
            ADICIONAR AO CARRINHO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
