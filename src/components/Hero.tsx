import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "JOGUE REAL E GANHE EM DOLAR!",
    subtitle: "Participe de loterias americanas com facilidade e privacidade.",
    buttonText: "Jogue Agora",
    buttonLink: "#lottery-games",
    bgColor: "bg-gradient-to-r from-lottery-red to-lottery-pink",
  },
  {
    id: 2,
    title: "Join My Lottery Rewards",
    subtitle: "Sign up to earn points and win exciting prizes!",
    buttonText: "Sign Up Now",
    buttonLink: "#",
    bgColor: "bg-gradient-to-r from-lottery-navy to-lottery-pink",
  },
  {
    id: 3,
    title: "New Scratch-Off Games",
    subtitle: "Try your luck with our new scratch-off games!",
    buttonText: "Play Now",
    buttonLink: "#",
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

  const scrollToSection = (id: string) => {
    const menuButton = document.querySelector('[aria-label="toggle menu"]');
    if (menuButton && window.innerWidth < 768) {
      menuButton.dispatchEvent(new Event('click'));
    }
    
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="hero-slider w-full overflow-hidden mt-20 relative">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${
            index === currentSlide ? "active" : ""
          } ${slide.bgColor} px-6 py-20 md:py-32 rounded-xl shadow-lg`}
        >
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl text-white font-bold mb-6">
                {slide.title}
              </h1>
              <p className="text-white text-lg md:text-xl mb-8">
                {slide.subtitle}
              </p>
              <Button 
                className="lottery-button bg-lottery-yellow text-lottery-navy hover:bg-lottery-yellow/90 font-semibold px-8 py-6 text-md rounded-full"
                onClick={() => {
                  const targetId = slide.buttonLink.replace('#', '');
                  scrollToSection(targetId);
                }}
              >
                {slide.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
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
