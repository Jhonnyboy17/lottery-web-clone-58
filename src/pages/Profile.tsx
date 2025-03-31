
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
import { Pencil } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { orderHistory, fetchOrderHistory } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Fetch order history when tab is games
    if (hash === "games" || !hash) {
      setIsLoading(true);
      fetchOrderHistory().finally(() => setIsLoading(false));
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
        
        <main className="flex-1 p-8">
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
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">Carregando seus jogos...</p>
                </div>
              ) : orderHistory && orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((item, index) => (
                    <div key={item.id || index} className="bg-[#2a1b4e] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            <img 
                              src={item.logoSrc} 
                              alt={item.gameName} 
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{item.gameName}</h3>
                            <p className="text-gray-300 text-sm">
                              {item.lineCount} {item.lineCount > 1 ? 'linhas' : 'linha'} • 
                              Comprado em {new Date(item.purchaseDate).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-gray-400 text-xs">Pedido: {item.orderNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">
                            {typeof item.price === 'number' 
                              ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                              : `R$ ${item.price}`}
                          </p>
                        </div>
                      </div>
                      
                      {item.lines && item.lines.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-purple-900/30">
                          <p className="text-sm text-gray-300 mb-2">Números jogados:</p>
                          <div className="space-y-2">
                            {item.lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex flex-wrap gap-1.5">
                                {line.numbers.map((num, numIdx) => (
                                  <span 
                                    key={numIdx} 
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-xs"
                                  >
                                    {num}
                                  </span>
                                ))}
                                
                                {line.powerball !== undefined && line.powerball !== null && (
                                  <>
                                    <span className="inline-flex items-center justify-center h-7 px-1 rounded-full bg-gray-100 text-gray-500 font-medium text-xs">
                                      +
                                    </span>
                                    <span 
                                      className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-100 text-red-600 font-medium text-xs"
                                    >
                                      {line.powerball}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8">Você ainda não possui jogos. Faça sua primeira aposta!</p>
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
