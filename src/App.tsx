
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Duvidas from "./pages/Duvidas";
import NotFound from "./pages/NotFound";
import PlayPage from "./components/PlayPage";
import Cash5Page from "./components/Cash5";
import FastPlayPage from "./components/FastPlay";
import ResultsHub from "./pages/ResultsHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/duvidas" element={<Duvidas />} />
          <Route path="/results-hub" element={<ResultsHub />} />
          
          {/* Mega Millions - R$15 */}
          <Route 
            path="/play-mega-millions" 
            element={<PlayPage />} 
          />
          
          {/* Powerball - R$15 */}
          <Route 
            path="/play-powerball" 
            element={<PlayPage />} 
          />
          
          {/* Lucky Day - R$15 */}
          <Route 
            path="/play-lucky-day" 
            element={<PlayPage />} 
          />
          
          {/* Pick 4 - R$10 */}
          <Route 
            path="/play-pick4" 
            element={<PlayPage />} 
          />
          
          {/* Cash 5 - R$8 */}
          <Route 
            path="/play-cash5" 
            element={
              <Cash5Page
                logoSrc="/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png"
                jackpotAmount="5.000" 
                basePrice={1}
                primaryColor="amber-500"
                gameName="Cash 5"
                extraPlayName="FIREBALL™"
              />
            } 
          />
          
          {/* Fast Play - R$8 */}
          <Route 
            path="/play-fast-play" 
            element={
              <FastPlayPage
                logoSrc="/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png"
                jackpotAmount="500" 
                basePrice={8}
                primaryColor="amber-500"
                gameName="Fast Play"
                extraPlayName="Fast Boost"
              />
            } 
          />
          
          <Route path="/responsible-play" element={<NotFound />} />
          <Route path="/casinos-gaming" element={<NotFound />} />
          <Route path="/retailer-corner" element={<NotFound />} />
          <Route path="/contact-us" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
