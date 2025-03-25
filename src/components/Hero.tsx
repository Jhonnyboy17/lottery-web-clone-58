
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <div className="hero-banner w-full h-[400px] rounded-xl shadow-lg overflow-hidden relative">
      <div className="w-full h-full bg-gradient-to-r from-lottery-purple to-lottery-pink relative">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          {/* Left side with person image */}
          <div className="hidden md:block w-1/3">
            <img
              src="/lovable-uploads/59487644-35d4-4cbe-b9d9-eba3b661a20b.png"
              alt="Man using smartphone"
              className="h-[400px] object-contain object-left"
            />
          </div>
          
          {/* Right side with text and button */}
          <div className="flex flex-col items-end justify-center w-full md:w-2/3 space-y-6 text-right">
            {/* Logo badges */}
            <div className="absolute top-6 left-6 flex space-x-2">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">18</div>
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">21</div>
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">30</div>
            </div>
            
            {/* Main heading with colored markers */}
            <div className="text-4xl md:text-5xl font-bold text-white">
              <div className="flex items-center justify-end">
                <div className="text-[#ff4d4d] mr-2">✓</div>
                Jogue em Real
              </div>
              <div className="flex items-center justify-end">
                Ganhe em Dolar
                <div className="text-[#4dff4d] ml-2">↗</div>
              </div>
            </div>
            
            {/* CTA Button */}
            <Link to="/#lottery-games">
              <Button className="bg-black hover:bg-black/80 text-white px-8 py-6 rounded-full text-lg font-bold">
                JOGAR AGORA
              </Button>
            </Link>
            
            {/* Promotion banner */}
            <div className="bg-black text-white px-4 py-2 font-semibold">
              -50% taxa na primeira compra!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
