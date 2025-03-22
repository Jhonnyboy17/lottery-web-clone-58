
import React from "react";
import { Button } from "@/components/ui/button";
import DrawOptions from "./DrawOptions";

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
  const [selectedDrawTime, setSelectedDrawTime] = React.useState("both");
  const [selectedDrawCount, setSelectedDrawCount] = React.useState("1");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-full">
      <DrawOptions 
        selectedDrawTime={selectedDrawTime}
        selectedDrawCount={selectedDrawCount}
        onDrawTimeChange={setSelectedDrawTime}
        onDrawCountChange={setSelectedDrawCount}
      />
      
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
