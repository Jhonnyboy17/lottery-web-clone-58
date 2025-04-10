
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

  // Handle authentication check and tab setting
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
  
  // Fetch games data once when authenticated
  useEffect(() => {
    const fetchGamesData = async () => {
      if (!loading && user && !isLoading) {
        setIsLoading(true);
        await fetchOrderHistory();
        setIsLoading(false);
      }
    };
    
    fetchGamesData();
    // Only re-run when user or loading status changes
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
