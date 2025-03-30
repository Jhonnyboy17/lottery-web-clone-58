import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, PlayCircle, HelpCircle, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-lottery-dark-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <PlayCircle className="w-8 h-8 mr-2 text-lottery-pink" />
            <span className="font-bold text-xl text-lottery-navy dark:text-white">
              Lovable Lottery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/" ? "font-medium text-lottery-pink" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/results-hub"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/results-hub" ? "font-medium text-lottery-pink" : ""
              }`}
            >
              Resultados
            </Link>
            <Link
              to="/duvidas"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/duvidas" ? "font-medium text-lottery-pink" : ""
              }`}
            >
              Dúvidas
            </Link>
            <Link
              to="/rapidapi-example"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/rapidapi-example" ? "font-medium text-lottery-pink" : ""
              }`}
            >
              RapidAPI
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none ml-4"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-lottery-dark-card p-4 shadow-md">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/" ? "font-medium text-lottery-pink" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/results-hub"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/results-hub" ? "font-medium text-lottery-pink" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Resultados
            </Link>
            <Link
              to="/duvidas"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/duvidas" ? "font-medium text-lottery-pink" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dúvidas
            </Link>
            <Link
              to="/rapidapi-example"
              className={`px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === "/rapidapi-example" ? "font-medium text-lottery-pink" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              RapidAPI
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
