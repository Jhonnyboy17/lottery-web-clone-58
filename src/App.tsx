import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Duvidas from "./pages/Duvidas";
import NotFound from "./pages/NotFound";
import PlayPage from "./components/PlayPage";
import Cash5Page from "./components/Cash5";
import FastPlayPage from "./components/FastPlay";
import ResultsHub from "./pages/ResultsHub";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/duvidas" element={<Duvidas />} />
              <Route path="/results-hub" element={<ResultsHub />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Mega Millions - R$15 */}
              <Route 
                path="/play-mega-millions" 
                element={
                  <PlayPage 
                    logoSrc="/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png"
                    jackpotAmount="344.000.000"
                    basePrice={15}
                    primaryColor="blue-600"
                    gameName="Mega Millions"
                    extraPlayName="Megaplier®"
                    maxRegularNumbers={5}
                    totalRegularNumbers={70}
                    maxPowerballNumbers={1}
                    totalPowerballNumbers={25}
                  />
                } 
              />
              
              {/* Powerball - R$15 */}
              <Route 
                path="/play-powerball" 
                element={
                  <PlayPage 
                    logoSrc="/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png"
                    jackpotAmount="444.000.000" 
                    basePrice={15}
                    primaryColor="red-600"
                    gameName="Powerball"
                    maxRegularNumbers={5}
                    totalRegularNumbers={69}
                    maxPowerballNumbers={1}
                    totalPowerballNumbers={26}
                  />
                } 
              />
              
              {/* Lucky Day - R$15 */}
              <Route 
                path="/play-lucky-day" 
                element={
                  <PlayPage 
                    logoSrc="/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png"
                    jackpotAmount="570.000" 
                    basePrice={15}
                    primaryColor="[#8CD444]"
                    gameName="Lucky Day Lotto"
                    extraPlayName="Lucky Boost"
                    maxRegularNumbers={6}
                    totalRegularNumbers={50}
                    maxPowerballNumbers={0}
                    totalPowerballNumbers={0}
                  />
                } 
              />
              
              {/* Pick 4 - R$10 */}
              <Route 
                path="/play-pick4" 
                element={
                  <PlayPage 
                    logoSrc="/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png"
                    jackpotAmount="100.000" 
                    basePrice={10}
                    primaryColor="cyan-600"
                    gameName="Pick 4"
                    extraPlayName="Pick Bonus"
                    maxRegularNumbers={5}
                    totalRegularNumbers={45}
                    maxPowerballNumbers={0}
                    totalPowerballNumbers={0}
                  />
                } 
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
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
