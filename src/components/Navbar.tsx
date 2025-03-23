
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-lottery-pink py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/lovable-uploads/40dbea4f-78a1-4de8-938d-6cc82fc77eae.png"
              alt="LottoFácil Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Main navigation - centered on desktop, moved closer to logo */}
          <nav className="hidden md:flex justify-center flex-grow ml-2 mr-8">
            <div className="flex items-center space-x-8">
              <button 
                onClick={scrollToGames}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Loterias
              </button>
              <button 
                onClick={navigateToResultsHub}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Resultados
              </button>
              <button 
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Ganhadores
              </button>
              <button 
                onClick={navigateToDuvidas}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Duvidas
              </button>
              <button 
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                Assistência
              </button>
            </div>
          </nav>

          {/* Right side icons - search & cart */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Larger search input as shown in the image */}
            <div className="relative">
              <div className="flex items-center w-64 bg-white rounded-full overflow-hidden">
                <Search className="absolute left-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="border-none pl-10 h-9 focus-visible:ring-0 bg-white w-full rounded-full"
                />
              </div>
            </div>
            <ShoppingCart className="h-6 w-6 text-white cursor-pointer" />
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
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrinho
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
