
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WalletTransaction } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const WalletTab: React.FC = () => {
  const { walletBalance, walletTransactions, addFundsToWallet, fetchWalletData } = useCart();
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState<string>("50");
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchWalletData().finally(() => setIsLoading(false));
    }
  }, [user]);
  
  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    addFundsToWallet(amount);
    setIsDepositDialogOpen(false);
  };

  return (
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
        
        {isLoading ? (
          <p className="text-gray-300 text-center py-8">Carregando transações...</p>
        ) : walletTransactions.length > 0 ? (
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
  );
};

export default WalletTab;
