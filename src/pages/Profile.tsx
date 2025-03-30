
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Settings, Bell, GamepadIcon, ClipboardCheck, 
  CreditCard, Pencil, MessageSquare 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Mock data for purchased games
const purchasedGames = [
  {
    id: 1,
    game: "Mega Millions",
    logo: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
    numbers: [5, 12, 35, 47, 63],
    powerball: [22],
    purchaseDate: "2023-10-15",
    drawDate: "2023-10-18",
  },
  {
    id: 2,
    game: "Powerball",
    logo: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
    numbers: [7, 14, 27, 41, 59],
    powerball: [15],
    purchaseDate: "2023-10-12",
    drawDate: "2023-10-16",
  }
];

// Mock data for transaction history
const transactionHistory = [
  { id: 1, type: "Deposit", amount: 100, date: "2023-10-01", status: "Completed" },
  { id: 2, type: "Purchase", amount: -15, date: "2023-10-05", status: "Completed" },
  { id: 3, type: "Purchase", amount: -15, date: "2023-10-08", status: "Completed" },
  { id: 4, type: "Withdrawal", amount: -50, date: "2023-10-12", status: "Processing" }
];

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(120); // Mock wallet balance
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "2023-10-01",
    endDate: "2023-10-31"
  });
  const [activeSection, setActiveSection] = useState("profile");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user?.email || "",
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (data: PasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      
      passwordForm.reset();
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;
      
      setUploading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update avatar URL in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);
        
      if (updateError) throw updateError;
      
      setAvatar(data.publicUrl);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setWalletBalance(prev => prev + parseFloat(depositAmount));
    toast.success(`Successfully deposited R$${depositAmount}`);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (parseFloat(withdrawAmount) > walletBalance) {
      toast.error("Insufficient funds");
      return;
    }
    
    setWalletBalance(prev => prev - parseFloat(withdrawAmount));
    toast.success(`Withdrawal of R$${withdrawAmount} initiated`);
    setWithdrawAmount("");
  };

  const sidebarItems = [
    { id: "profile", icon: User, label: "Meu Perfil" },
    { id: "notifications", icon: Bell, label: "Notificações" },
    { id: "games", icon: GamepadIcon, label: "Meus Jogos" },
    { id: "subscription", icon: ClipboardCheck, label: "Inscrição" },
    { id: "wallet", icon: CreditCard, label: "Carteira" },
    { id: "settings", icon: Settings, label: "Configurações da Conta" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>Please log in to view your profile.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                  <TabsTrigger value="password">Alterar Senha</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sobrenome</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu sobrenome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={avatar || profile?.avatar_url} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xl">
                            {profile?.first_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" className="flex items-center">
                              <Pencil className="h-4 w-4 mr-2" />
                              Mudar Foto
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Atualizar Foto</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex justify-center">
                                <Avatar className="w-32 h-32">
                                  <AvatarImage src={avatar || profile?.avatar_url} />
                                  <AvatarFallback className="text-3xl">
                                    {profile?.first_name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex justify-center">
                                <Label htmlFor="avatar" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                                  {uploading ? "Fazendo upload..." : "Escolher arquivo"}
                                  <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    disabled={uploading}
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                  />
                                </Label>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        Salvar alterações
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="password">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha atual</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar nova senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full md:w-auto">
                        Atualizar senha
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      
      case "notifications":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Gerencie suas preferências de notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Não há notificações no momento.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      
      case "games":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Meus Jogos</CardTitle>
              <CardDescription>
                Visualize seus bilhetes de jogos comprados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchasedGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchasedGames.map((game) => (
                    <Card key={game.id} className="overflow-hidden">
                      <div className="p-4 border-b flex items-center gap-3">
                        <img 
                          src={game.logo} 
                          alt={game.game} 
                          className="h-8 w-auto" 
                        />
                        <h3 className="font-medium">{game.game}</h3>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">Números:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {game.numbers.map((num, i) => (
                              <span 
                                key={i} 
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm"
                              >
                                {num}
                              </span>
                            ))}
                            
                            {game.powerball && game.powerball.length > 0 && (
                              <>
                                <span className="inline-flex items-center justify-center h-8 px-2 rounded-full bg-gray-100 text-gray-500 font-medium text-sm">
                                  +
                                </span>
                                {game.powerball.map((num, i) => (
                                  <span 
                                    key={i} 
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium text-sm"
                                  >
                                    {num}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Data da compra:</p>
                            <p>{game.purchaseDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data do sorteio:</p>
                            <p>{game.drawDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Você ainda não comprou nenhum jogo.</p>
                  <Button className="mt-4" variant="outline">Comprar jogos</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case "subscription":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inscrição</CardTitle>
              <CardDescription>
                Gerencie sua assinatura premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">Assinatura Premium</h3>
                    <p>Assine e tenha 100% de desconto em todas as taxas de serviço nas suas compras!</p>
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Assinar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        );
      
      case "wallet":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Carteira</CardTitle>
              <CardDescription>
                Gerencie seus fundos e visualize o histórico de transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo atual</p>
                    <p className="text-2xl font-bold">R$ {walletBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="deposit">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="deposit">Depositar</TabsTrigger>
                  <TabsTrigger value="withdraw">Retirar</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
                </TabsList>

                <TabsContent value="deposit" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deposit-amount">Valor para depositar (R$)</Label>
                          <Input
                            id="deposit-amount"
                            type="number"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[50, 100, 200, 500].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              onClick={() => setDepositAmount(amount.toString())}
                            >
                              R$ {amount}
                            </Button>
                          ))}
                        </div>
                        <Button className="w-full" onClick={handleDeposit}>
                          Depositar Fundos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="withdraw" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="withdraw-amount">Valor para retirar (R$)</Label>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            placeholder="0.00"
                            max={walletBalance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[25, 50, 100].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              disabled={amount > walletBalance}
                              onClick={() => setWithdrawAmount(amount.toString())}
                            >
                              R$ {amount}
                            </Button>
                          ))}
                        </div>
                        <Button className="w-full" onClick={handleWithdraw}>
                          Retirar Fundos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactionHistory.length > 0 ? (
                            transactionHistory.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                                  {transaction.amount > 0 ? `+R$ ${transaction.amount}` : `-R$ ${Math.abs(transaction.amount)}`}
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    transaction.status === "Completed" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {transaction.status}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">Nenhuma transação encontrada</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="start-date">Data inicial</Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={dateRange.startDate}
                              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-date">Data final</Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={dateRange.endDate}
                              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <Button className="w-full">Gerar Relatório</Button>
                        
                        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total de depósitos</p>
                                <p className="text-2xl font-bold text-green-600">R$ 100,00</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total de compras</p>
                                <p className="text-2xl font-bold text-red-600">R$ 30,00</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Saldo líquido</p>
                                <p className="text-2xl font-bold">R$ 70,00</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      
      case "settings":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>
                Gerencie as configurações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Receber notificações por e-mail</p>
                    <p className="text-sm text-muted-foreground">Receba atualizações sobre novos jogos e resultados</p>
                  </div>
                  <div>
                    <input type="checkbox" id="email-notifications" className="toggle" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Selecione uma opção no menu.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <SidebarProvider>
          <div className="flex min-h-[500px] w-full">
            <Sidebar variant="floating" collapsible="icon">
              <SidebarContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        tooltip={item.label}
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="p-4">
              <div className="w-full h-full">
                {renderActiveSection()}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
