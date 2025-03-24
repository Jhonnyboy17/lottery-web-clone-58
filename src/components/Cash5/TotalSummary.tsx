
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
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-full">
      <div className="flex justify-between items-center p-3 border-t">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-xl font-bold">R$ {ticketPrice}</p>
        </div>
        <Button 
          className="hover:bg-opacity-90 px-12"
          style={{ backgroundColor: colorValue }}
          disabled={!hasLines}
        >
          ADICIONAR AO CARRINHO
        </Button>
      </div>
    </div>
  );
};

export default TotalSummary;
