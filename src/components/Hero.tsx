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
    bgImage: "/lovable-uploads/e669d7b8-590c-495c-b8ca-8e28fd60329b.png",
  },
  {
    id: 2,
    bgImage: "/lovable-uploads/f5fa6c1e-b6ee-49c3-a80c-83267aa804a9.png",
  },
  {
    id: 3,
    bgImage: "/lovable-uploads/93d1d5a1-a64a-4dbf-8a04-183eb624bf25.png",
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
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    setIsAutoPlay(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsAutoPlay(true);
  };

  return (
    <div className="hero-slider w-full overflow-hidden mt-20 relative rounded-xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide absolute top-0 left-0 w-full h-full ${
            index === currentSlide ? "active" : ""
          } ${slide.bgColor || ""} shadow-lg h-full cursor-pointer`}
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
          {slide.content && slide.content}
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
