
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPlayPage = location.pathname.includes('/play-');

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
    if (isOpen) setIsOpen(false);
    
    if (window.location.pathname === '/') {
      const gamesSection = document.getElementById('lottery-games');
      if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#lottery-games';
    }
  };

  const navigateToResultsHub = () => {
    if (isOpen) setIsOpen(false);
    
    navigate('/results-hub');
    window.scrollTo(0, 0);
  };

  const navigateToDuvidas = () => {
    if (isOpen) setIsOpen(false);
    
    navigate('/duvidas');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const navbarClasses = "fixed top-0 left-0 right-0 z-50 bg-[#1a0f36]/95 py-3";

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={navigateToHome} className="flex-shrink-0">
            <img
              src="/lovable-uploads/49af7c32-e87d-4f46-a005-b535bbdf18ed.png"
              alt="LotoEasy Logo"
              className="h-16 w-auto"
            />
          </Link>

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

          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <div className="relative">
              <div className="flex items-center w-64 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                <Search className="absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="border-none pl-10 h-9 focus-visible:ring-0 bg-white w-full rounded-full dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <ShoppingCart className="h-6 w-6 text-white cursor-pointer" />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1a0f36]/95 animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
              onClick={scrollToGames}
            >
              Loterias
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
              onClick={navigateToResultsHub}
            >
              Resultados
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
            >
              Ganhadores
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
              onClick={navigateToDuvidas}
            >
              Duvidas
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
            >
              Assistência
            </Button>
            <Separator className="my-2 bg-white/20" />
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80 hover:bg-[#2d1d4d]/95"
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
