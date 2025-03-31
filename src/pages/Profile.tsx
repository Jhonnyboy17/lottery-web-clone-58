
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSidebar from "@/components/ProfileSidebar";
import { Pencil, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { orderHistory } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
    
    // Set active tab based on hash
    const hash = location.hash.substring(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, [user, profile, loading, navigate, location.hash]);

  const handleSave = () => {
    toast.success("Alterações salvas com sucesso!");
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };
  
  const avatarColor = "bg-purple-700";

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#120a29]">
      <ProfileSidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8 mt-32">
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-2">Meu Perfil</h1>
                <p className="text-gray-300 mb-6">Gerencie suas informações pessoais e senha</p>
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                    <TabsTrigger value="password">Alterar Senha</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="firstName" className="text-white">Nome</Label>
                          <Input 
                            id="firstName" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            className="bg-[#2a1b4e] border-purple-800 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
                          <Input 
                            id="lastName" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            className="bg-[#2a1b4e] border-purple-800 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <Input 
                            id="email" 
                            value={user?.email || ""} 
                            readOnly 
                            className="bg-[#2a1b4e] border-purple-800 text-white opacity-70"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-start space-y-4">
                        <Avatar className={`h-24 w-24 ${avatarColor}`}>
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>
                        
                        <Button variant="outline" className="flex items-center gap-2">
                          <Pencil size={16} />
                          Mudar Foto
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSave} 
                      className="mt-8 bg-purple-600 hover:bg-purple-700"
                    >
                      Salvar alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="password">
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="currentPassword" className="text-white">Senha Atual</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          className="bg-[#2a1b4e] border-purple-800 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword" className="text-white">Nova Senha</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          className="bg-[#2a1b4e] border-purple-800 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword" className="text-white">Confirmar Nova Senha</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          className="bg-[#2a1b4e] border-purple-800 text-white"
                        />
                      </div>
                      
                      <Button 
                        onClick={() => toast.success("Senha alterada com sucesso!")} 
                        className="mt-4 bg-purple-600 hover:bg-purple-700"
                      >
                        Alterar Senha
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          
          {activeTab === "games" && (
            <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Meus Jogos</h1>
              
              {orderHistory && orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="bg-[#2a1b4e] rounded-lg p-4 border border-purple-900/30">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <Package className="text-purple-400" />
                          <h3 className="text-lg font-semibold text-white">Pedido #{index + 1000}</h3>
                        </div>
                        <span className="text-sm text-purple-300">
                          {new Date().toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 p-2 bg-[#1a0f36]/50 rounded-md">
                            {item.logoSrc && (
                              <img src={item.logoSrc} alt={item.gameName} className="h-8 w-8" />
                            )}
                            <div>
                              <p className="text-white font-medium">{item.gameName}</p>
                              <p className="text-sm text-gray-300">{item.lineCount} {item.lineCount > 1 ? 'jogos' : 'jogo'}</p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-white">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-purple-900/30 flex justify-between">
                        <span className="text-gray-300">Total</span>
                        <span className="text-lg font-semibold text-white">
                          R$ {order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Package className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                  <p className="text-gray-300 mb-4">Você ainda não possui jogos.</p>
                  <Button 
                    onClick={() => navigate('/')} 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Jogar agora
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "notifications" && (
            <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Notificações</h1>
              <p className="text-gray-300">Você não possui notificações.</p>
            </div>
          )}
          
          {activeTab === "subscription" && (
            <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Inscrição</h1>
              <p className="text-gray-300">Você não possui nenhuma inscrição ativa.</p>
            </div>
          )}
          
          {activeTab === "wallet" && (
            <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Carteira</h1>
              <p className="text-gray-300">Saldo atual: R$ 0,00</p>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Configurações da Conta</h1>
              <p className="text-gray-300">Configurações gerais da sua conta.</p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
