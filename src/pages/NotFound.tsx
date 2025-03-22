
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto py-16">
          <div className="inline-block bg-lottery-pink/10 p-4 rounded-full mb-6">
            <span className="text-6xl text-lottery-pink">404</span>
          </div>
          <h1 className="text-3xl font-bold text-lottery-navy mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            asChild
            className="lottery-button bg-lottery-pink text-white hover:bg-lottery-pink/90 px-6 py-3 rounded-full transition-all duration-300 flex items-center mx-auto"
          >
            <a href="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </a>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
