
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
import { Pencil, Calendar, CheckCircle, XCircle, PlusCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { 
    orderHistory, 
    fetchOrderHistory, 
    walletBalance, 
    addFundsToWallet, 
    walletTransactions
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("50");
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

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
  
  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor, insira um valor válido");
      return;
    }
    
    addFundsToWallet(amount);
    setIsDepositDialogOpen(false);
    toast.success(`R$ ${amount.toFixed(2)} adicionado à sua carteira!`);
  };
  
  // Separar jogos futuros e passados
  const upcomingGames = orderHistory.filter(game => !game.completed);
  const pastGames = orderHistory.filter(game => game.completed);
  
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
            <div className="space-y-8">
              <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Meus Jogos</h1>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300">Carregando seus jogos...</p>
                  </div>
                ) : (
                  <>
                    {upcomingGames.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Calendar className="mr-2 h-5 w-5" />
                          Jogos Futuros
                        </h2>
                        <div className="space-y-4">
                          {upcomingGames.map((item, index) => (
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
                                  <p className="text-green-400 text-sm flex items-center justify-end">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Ativo
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
                      </div>
                    )}
                    
                    {pastGames.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <XCircle className="mr-2 h-5 w-5" />
                          Jogos Encerrados
                        </h2>
                        <div className="space-y-4">
                          {pastGames.map((item, index) => (
                            <div key={item.id || index} className="bg-[#2a1b4e] rounded-lg p-4 opacity-70">
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
                                  <p className="text-gray-400 text-sm flex items-center justify-end">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Encerrado
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
                      </div>
                    )}
                    
                    {upcomingGames.length === 0 && pastGames.length === 0 && (
                      <p className="text-gray-300 text-center py-8">Você ainda não possui jogos. Faça sua primeira aposta!</p>
                    )}
                  </>
                )}
              </div>
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
            <div className="space-y-8">
              <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-white">Carteira</h1>
                  
                  <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Adicionar Fundos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a0f36] text-white border-purple-900/60">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Adicionar Fundos</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Escolha o valor que deseja adicionar à sua carteira.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount" className="text-white">Valor (R$)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="10"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="50.00"
                            className="bg-[#2a1b4e] border-purple-800 text-white"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          {[50, 100, 200, 500].map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant="outline"
                              className="flex-1 border-purple-500 hover:bg-purple-700/30"
                              onClick={() => setDepositAmount(amount.toString())}
                            >
                              R$ {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="ghost" 
                          onClick={() => setIsDepositDialogOpen(false)}
                          className="text-white hover:bg-purple-700/20"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleDeposit}
                        >
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="p-6 bg-[#2a1b4e] rounded-xl mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-300">Saldo atual</p>
                      <h2 className="text-3xl font-bold text-white">
                        {walletBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </h2>
                    </div>
                    <div className="p-4 bg-purple-700/30 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-4">Histórico de Transações</h2>
                
                {walletTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-900/30">
                        <TableHead className="text-gray-300">Data</TableHead>
                        <TableHead className="text-gray-300">Descrição</TableHead>
                        <TableHead className="text-gray-300 text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {walletTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-purple-900/20">
                          <TableCell className="text-gray-300">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-white">{transaction.description}</TableCell>
                          <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}
                            {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-300 text-center py-8">Nenhuma transação encontrada.</p>
                )}
              </div>
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
