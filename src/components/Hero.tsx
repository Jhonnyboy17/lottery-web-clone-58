import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative w-full max-w-full px-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(70%)',
        }}
      ></div>
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Aposte e Ganhe na Loteria Online
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          A sorte está ao seu alcance. Jogue agora e realize seus sonhos!
        </p>
        <Button size="lg" className="bg-lottery-pink hover:bg-lottery-pink/80 text-white rounded-full">
          Apostar Agora <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
