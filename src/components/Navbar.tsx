
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-lottery-pink shadow-md py-2" : "bg-lottery-pink py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/465446bc-e8de-4e99-8b80-cad0bf55e056.png"
                alt="Maryland Lottery Logo"
                className="h-12 w-auto animate-float"
              />
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            <div className="bg-lottery-pink/90 backdrop-blur-sm rounded-full p-2 flex items-center gap-1">
              <img
                src="/lovable-uploads/2c8d0db8-59c6-4a70-8636-28d84c3652b2.png"
                alt="Scratch Offs"
                className="h-10 w-auto rounded-full"
              />
              <img
                src="/lovable-uploads/de38df5e-ac1d-4fda-be66-c08af27fd6f8.png"
                alt="My Lottery Rewards"
                className="h-10 w-auto rounded-full"
              />
              <div className="flex items-center gap-4 ml-2 mr-2">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
                >
                  Enter Tickets
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm rounded-full"
                >
                  Claim a Prize
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 flex items-center gap-1 transition-colors duration-300 font-medium text-sm rounded-full"
                >
                  <Search className="w-4 h-4" /> Search
                </Button>
              </div>
            </div>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
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
            >
              Enter Tickets
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              Claim a Prize
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lottery-pink hover:text-lottery-pink/80 hover:bg-gray-100"
            >
              Search
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
