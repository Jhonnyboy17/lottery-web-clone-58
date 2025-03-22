
import React from "react";

const GameHeader = () => {
  return (
    <div className="relative w-full">
      {/* Faixa laranja ampliada */}
      <div className="absolute top-[-40px] left-0 w-screen h-20 bg-orange-500" />
      <div className="relative flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Nome do Jogo</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Jogar Agora</button>
      </div>
    </div>
  );
};

export default GameHeader;
