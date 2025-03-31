
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, User, LogOut, Bell, GamepadIcon, ClipboardCheck, Wallet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import CartDrawer from "./Cart/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

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

  const navigateToAuth = () => {
    if (isOpen) setIsOpen(false);
    
    navigate('/auth');
    window.scrollTo(0, 0);
  };

  const navigateToProfile = (section = "") => {
    if (isOpen) setIsOpen(false);
    
    navigate('/profile' + (section ? `#${section}` : ''));
    window.scrollTo(0, 0);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
    navigate('/');
  };

  const navbarClasses = "fixed top-0 left-0 right-0 z-50 bg-[#1a0f36]/95 flex flex-col";

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <header className={navbarClasses}>
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
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
              <div className="flex items-center w-64 bg-white-element dark:bg-gray-800 rounded-full overflow-hidden">
                <Search className="absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="border-none pl-10 h-9 focus-visible:ring-0 bg-white-element w-full rounded-full dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            {user ? (
              <>
                <div className="text-white/80 text-sm py-1 hidden md:block">
                  Bem-vindo, {displayName}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-purple-600/20 text-white">
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateToProfile("profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfile("notifications")}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notificações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfile("games")}>
                      <GamepadIcon className="mr-2 h-4 w-4" />
                      <span>Meus Jogos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfile("subscription")}>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      <span>Inscrição</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfile("wallet")}>
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Carteira</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToProfile("settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações da Conta</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}
            
            <CartDrawer />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-purple-600/20 text-white">
                      <User size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateToProfile()}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}
            <CartDrawer />
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

      {/* Auth Banner - Only show if user is not logged in */}
      {!user && (
        <div className="w-full bg-[#2a1c4b] py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-white/90 text-sm font-medium">
              Quer 10% off no seu primeiro pedido?
            </div>
            
            <div className="space-x-4">
              <Button 
                onClick={navigateToAuth} 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-white/80 hover:bg-purple-800/30"
              >
                Entrar
              </Button>
              <Button 
                onClick={navigateToAuth} 
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-purple-800/30 hover:text-white"
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a0f36]/95 animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            {user && (
              <div className="text-white/80 text-sm py-2 px-2 border-b border-white/10 mb-2">
                Bem-vindo, {displayName}
              </div>
            )}
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
