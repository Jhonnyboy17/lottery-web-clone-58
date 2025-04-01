
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { UserProfile } from "@/contexts/AuthContext";

interface PersonalInfoTabProps {
  user: any;
  profile: UserProfile | null;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user, profile }) => {
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  
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

  return (
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
  );
};

export default PersonalInfoTab;
