
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import ProfileLayout from "@/components/profile/ProfileLayout";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import GamesTab from "@/components/profile/GamesTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import WalletTab from "@/components/profile/WalletTab";
import SettingsTab from "@/components/profile/SettingsTab";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { 
    orderHistory, 
    fetchOrderHistory
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    
    // Set active tab based on hash
    const hash = location.hash.substring(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, [user, loading, navigate, location.hash]);
  
  // Separar o efeito que busca os jogos
  useEffect(() => {
    // Verificar se o usuário está autenticado antes de buscar os jogos
    if (!loading && user) {
      setIsLoading(true);
      // Sempre buscar os jogos quando a página de perfil é aberta, independente da aba
      fetchOrderHistory().finally(() => setIsLoading(false));
    }
  }, [user, loading, fetchOrderHistory]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <ProfileLayout>
      {activeTab === "profile" && (
        <PersonalInfoTab user={user} profile={profile} />
      )}
      
      {activeTab === "games" && (
        <GamesTab isLoading={isLoading} orderHistory={orderHistory} />
      )}
      
      {activeTab === "notifications" && (
        <NotificationsTab />
      )}
      
      {activeTab === "subscription" && (
        <SubscriptionTab />
      )}
      
      {activeTab === "wallet" && (
        <WalletTab />
      )}
      
      {activeTab === "settings" && (
        <SettingsTab />
      )}
    </ProfileLayout>
  );
};

export default Profile;
