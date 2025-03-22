
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    title: "JOGUE EM REAL E GANHE EM DOLAR",
    subtitle: "Participe de loterias americanas com facilidade e privacidade.",
    buttonText: "JOGUE AGORA",
    buttonLink: "#",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
              <Button className="lottery-button bg-lottery-yellow text-lottery-navy hover:bg-lottery-yellow/90 font-semibold px-8 py-6 text-md rounded-full">
                {slide.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="slide-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`slide-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
