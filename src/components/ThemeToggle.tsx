
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Inicializa o tema com base na preferência salva ou na preferência do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-400'}`} />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme} 
        className={`${isDarkMode ? 'bg-purple-600' : 'bg-gray-200'}`}
      />
      <Moon className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-400'}`} />
    </div>
  );
};

export default ThemeToggle;
