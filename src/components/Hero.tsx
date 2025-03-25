
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    bgColor: "bg-gradient-to-r from-lottery-red to-lottery-pink",
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

  const handleManualNavigation = () => {
    setIsAutoPlay(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goToPreviousSlide = () => {
    handleManualNavigation();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    handleManualNavigation();
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    handleManualNavigation();
    setCurrentSlide(index);
  };

  return (
    <div className="hero-slider w-full overflow-hidden mt-20 relative">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${
            index === currentSlide ? "active" : ""
          } ${slide.bgColor} rounded-xl shadow-lg h-full`}
        />
      ))}

      <button 
        onClick={goToPreviousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="slide-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`slide-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
