
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
    content: (
      <div className="flex flex-col md:flex-row items-center justify-between h-full px-8 py-12 md:px-16">
        <div className="flex-1">
          {/* Left content is in the image */}
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-white z-10 mt-4 md:mt-0">
          <div className="border-2 border-white rounded-full px-6 py-2 mb-8 text-xl font-bold">
            10% off na primeira compra!
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">Jogue em Real</h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center md:text-left">Ganhe em Dolar</h2>
          <Link to="/play-mega-millions" className="border-2 border-white rounded-full px-10 py-3 text-xl font-bold hover:bg-white hover:bg-opacity-20 transition-all">
            JOGAR AGORA!
          </Link>
        </div>
      </div>
    )
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
      
      {/* Slide dots navigation */}
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
