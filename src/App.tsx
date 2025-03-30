
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ResultsHub from "@/pages/ResultsHub";
import Duvidas from "@/pages/Duvidas";
import NotFound from "@/pages/NotFound";
import PlayPage from "@/components/PlayPage";
import Cash5 from "@/components/Cash5";
import FastPlay from "@/components/FastPlay";
import { Toaster } from "@/components/ui/toaster";
import RapidApiExample from "@/components/RapidApiExample";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results-hub" element={<ResultsHub />} />
          <Route path="/duvidas" element={<Duvidas />} />
          <Route path="/play-mega-millions" element={<PlayPage />} />
          <Route path="/play-powerball" element={<PlayPage />} />
          <Route path="/play-lucky-day" element={<PlayPage />} />
          <Route path="/play-pick4" element={<PlayPage />} />
          <Route path="/play-cash5" element={<Cash5 />} />
          <Route path="/play-fast-play" element={<FastPlay />} />
          <Route path="/rapidapi-example" element={<RapidApiExample />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
