import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToGames = () => {
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // If we're already on the homepage, scroll to the games section
    if (window.location.pathname === '/') {
      const gamesSection = document.getElementById('lottery-games');
      if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to homepage and then scroll to games
      // We'll use a URL hash to trigger the scroll after navigation
      window.location.href = '/#lottery-games';
    }
  };

  const navigateToDuvidas = () => {
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // Navigate to the Duvidas page and scroll to top
    navigate('/duvidas');
    // Force scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-lottery-pink shadow-md py-2" : "bg-lottery-pink py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Changed from NavLink to clickable div that triggers scrollToGames */}
          <div onClick={scrollToGames} className="flex items-center cursor-pointer">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/40dbea4f-78a1-4de8-938d-6cc82fc77eae.png"
                alt="LottoFácil Logo"
                className="h-16 w-auto"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="bg-lottery-pink/90 backdrop-blur-sm rounded-full p-2 flex items-center gap-6 px-6">
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
                onClick={scrollToGames}
              >
                Loterias
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
              >
                Resultados
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
              >
                Ganhadores
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
                onClick={navigateToDuvidas}
              >
                Duvidas
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
              >
                Assistência
              </Button>
            </div>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
              onClick={scrollToGames}
            >
              Loterias
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              Resultados
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              Ganhadores
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
              onClick={navigateToDuvidas}
            >
              Duvidas
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              Assistência
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
