
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface Slide {
  id: number;
  bgImage?: string;
  bgColor?: string;
  content?: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 1,
    bgColor: "bg-gradient-to-r from-[#1a1433] to-[#d4236d]",
    content: (
      <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-12 py-8">
        <div className="flex-shrink-0 md:w-1/3">
          <img 
            src="/lovable-uploads/65432b76-8584-4a84-87cb-83281d7e435a.png" 
            alt="Man using phone" 
            className="w-full h-auto max-h-80 md:max-h-none object-contain"
          />
        </div>
        <div className="flex flex-col items-end justify-center md:w-2/3 space-y-4 mt-4 md:mt-0">
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl font-bold text-white flex items-center">
              <span className="text-[#ff473e] mr-2">✓</span> Jogue em Real
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-white flex items-center">
              Ganhe em Dolar <span className="text-[#8CD444] ml-2">↗</span>
            </h2>
          </div>
          <Button 
            className="bg-black hover:bg-black/80 text-white px-8 py-6 rounded-full text-lg font-bold"
            onClick={() => window.location.href = '/#lottery-games'}
          >
            JOGAR AGORA
          </Button>
          <div className="bg-black px-4 py-2 text-white font-semibold">
            -50% taxa na primeira compra!
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    bgColor: "bg-gradient-to-r from-lottery-navy to-lottery-pink",
    content: (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Maiores Prêmios do Brasil</h2>
        <p className="text-xl text-white mb-8">Jogue suas loterias favoritas e ganhe milhões</p>
        <Button 
          className="bg-white hover:bg-white/90 text-lottery-pink px-8 py-6 rounded-full text-lg font-bold"
          onClick={() => window.location.href = '/#lottery-games'}
        >
          VER JOGOS
        </Button>
      </div>
    )
  },
  {
    id: 3,
    bgColor: "bg-gradient-to-r from-lottery-purple to-lottery-pink",
    content: (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Resultados Instantâneos</h2>
        <p className="text-xl text-white mb-8">Confira os resultados e ganhe seus prêmios rapidamente</p>
        <Button 
          className="bg-white hover:bg-white/90 text-lottery-pink px-8 py-6 rounded-full text-lg font-bold"
          onClick={() => window.location.href = '/results-hub'}
        >
          VER RESULTADOS
        </Button>
      </div>
    )
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();

  const startAutoSlide = () => {
    if (!isAutoPlay) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
  };

  useEffect(() => {
    if (isAutoPlay) {
      startAutoSlide();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlay]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 1000);
  };

  return (
    <div className="hero-slider w-full overflow-hidden relative h-[400px] md:h-[450px] rounded-xl shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide absolute top-0 left-0 w-full h-full ${
            index === currentSlide ? "active" : ""
          } ${slide.bgColor || ""} transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={slide.bgImage ? { 
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {slide.content}
        </div>
      ))}

      <div className="slide-dots absolute bottom-4 left-0 right-0 flex justify-center z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slide-dot mx-1 w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-110" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
