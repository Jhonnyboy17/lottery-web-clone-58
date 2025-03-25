
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="flex-shrink-0 md:w-1/2 lg:w-2/5">
          <img 
            src="/lovable-uploads/cb686e7c-d157-46e5-8b43-846a0dce28eb.png" 
            alt="Man using smartphone"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-end justify-center md:w-1/2 lg:w-3/5 space-y-4 mt-4 md:mt-0 text-right">
          <div className="flex flex-col items-end">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white flex items-center">
              <span className="text-[#ff473e] mr-2">▼</span> Jogue em Real
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white flex items-center mt-2">
              Ganhe em Dolar <span className="text-[#8CD444] ml-2">▲</span>
            </h2>
          </div>
          
          <Link to="/play-mega-millions" className="mt-6">
            <button className="bg-black text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-gray-900 transition-colors">
              JOGAR AGORA
            </button>
          </Link>
          
          <div className="bg-black text-white px-4 py-2 rounded-sm mt-4 text-lg">
            -50% taxa na primeira compra!
          </div>
          
          <div className="flex mt-4 space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold">12</div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold">24</div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold">36</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    bgColor: "bg-gradient-to-r from-lottery-navy to-lottery-pink",
  },
  {
    id: 3,
    bgColor: "bg-gradient-to-r from-lottery-purple to-lottery-pink",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const startAutoSlide = () => {
    if (!isAutoPlay) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
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

  const handleSlideClick = () => {
    // Move to the next slide when the current slide is clicked
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    // Reset autoplay timer
    setIsAutoPlay(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Restart autoplay after manual navigation
    setIsAutoPlay(true);
  };

  return (
    <div className="hero-slider w-full overflow-hidden mt-20 relative h-[400px] md:h-[450px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${
            index === currentSlide ? "active" : ""
          } ${slide.bgColor || ""} rounded-xl shadow-lg h-full cursor-pointer`}
          onClick={handleSlideClick}
          role="button"
          tabIndex={0}
          aria-label={`Slide ${index + 1}, click to advance`}
          style={slide.bgImage ? { 
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {slide.content}
        </div>
      ))}
      
      <div className="slide-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slide-dot ${index === currentSlide ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
              setIsAutoPlay(false);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              setIsAutoPlay(true);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
