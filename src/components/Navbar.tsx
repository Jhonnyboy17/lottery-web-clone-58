
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

  const navigateToResultsHub = () => {
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // Navigate to the Results Hub page and scroll to top
    navigate('/results-hub');
    // Force scroll to top
    window.scrollTo(0, 0);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-lottery-pink py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo on the left */}
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/40dbea4f-78a1-4de8-938d-6cc82fc77eae.png"
              alt="LottoFácil Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop menu items right-aligned */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToGames}
              className="text-white hover:text-white/80 transition-colors font-medium text-sm"
            >
              Loterias
            </button>
            <button 
              onClick={navigateToResultsHub}
              className="text-white hover:text-white/80 transition-colors font-medium text-sm"
            >
              Resultados
            </button>
            <button 
              className="text-white hover:text-white/80 transition-colors font-medium text-sm"
            >
              Ganhadores
            </button>
            <button 
              onClick={navigateToDuvidas}
              className="text-white hover:text-white/80 transition-colors font-medium text-sm"
            >
              Duvidas
            </button>
            <button 
              className="text-white hover:text-white/80 transition-colors font-medium text-sm"
            >
              Assistência
            </button>
          </div>

          {/* Mobile menu button */}
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
              onClick={navigateToResultsHub}
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
