
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
    <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
      <div>
        <p className="text-sm font-medium">Total</p>
        <p className="text-xl font-bold">R$ {ticketPrice}</p>
      </div>
      <Button 
        className="hover:bg-opacity-90"
        style={{ backgroundColor: colorValue }}
        disabled={!hasLines}
      >
        ADD TO CART
      </Button>
    </div>
  );
};

export default TotalSummary;
