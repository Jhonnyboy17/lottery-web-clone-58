
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GamepadIcon, User, Bell, ClipboardCheck, Wallet, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: "profile", 
      label: "Meu Perfil", 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      id: "games", 
      label: "Meus Jogos", 
      icon: <GamepadIcon className="h-5 w-5" /> 
    },
    { 
      id: "notifications", 
      label: "Notificações", 
      icon: <Bell className="h-5 w-5" /> 
    },
    { 
      id: "subscription", 
      label: "Inscrição", 
      icon: <ClipboardCheck className="h-5 w-5" /> 
    },
    { 
      id: "wallet", 
      label: "Carteira", 
      icon: <Wallet className="h-5 w-5" /> 
    },
    { 
      id: "settings", 
      label: "Configurações da Conta", 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  const isActive = (id: string) => {
    return location.hash === `#${id}` || (!location.hash && id === "profile");
  };

  const handleMenuClick = (id: string) => {
    navigate(`/profile#${id}`);
  };

  return (
    <div className="w-60 bg-[#1a0f36]/80 min-h-screen p-4">
      <div className="flex justify-center mb-8">
        <img
          src="/lovable-uploads/49af7c32-e87d-4f46-a005-b535bbdf18ed.png"
          alt="LotoEasy Logo"
          className="h-14 w-auto"
        />
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={cn(
              "flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-colors",
              isActive(item.id)
                ? "bg-purple-700/30 text-white"
                : "text-white/70 hover:bg-purple-700/20 hover:text-white"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
