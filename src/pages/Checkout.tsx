
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { CreditCard, Wallet, Tag, ArrowRight, ChevronsUpDown, Bitcoin, Coins } from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, addToOrderHistory, walletBalance, deductFromWallet } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cryptoAddress, setCryptoAddress] = useState<string>("");

  const subtotal = getCartTotal();
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee - discount;

  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    
    // Simulate coupon check
    setTimeout(() => {
      if (couponCode.toLowerCase() === "first10") {
        const newDiscount = subtotal * 0.1;
        setDiscount(newDiscount);
        toast.success("Cupom aplicado com sucesso!");
      } else {
        toast.error("Cupom inválido ou expirado");
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleCompleteOrder = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra");
      navigate("/auth");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let paymentSuccess = false;
      
      if (paymentMethod === "wallet") {
        // Verify wallet balance
        if (walletBalance < total) {
          toast.error("Saldo insuficiente na carteira");
          setIsProcessing(false);
          return;
        }
        
        // Process wallet payment
        paymentSuccess = await deductFromWallet(total);
      } 
      else if (paymentMethod === "credit-card") {
        // Simulate credit card processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        paymentSuccess = true;
      }
      else if (paymentMethod === "bitcoin" || paymentMethod === "litecoin") {
        if (!cryptoAddress) {
          toast.error(`Endereço de ${paymentMethod === "bitcoin" ? "Bitcoin" : "Litecoin"} é necessário`);
          setIsProcessing(false);
          return;
        }
        
        // Simulate crypto payment verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success(`Pagamento em ${paymentMethod === "bitcoin" ? "Bitcoin" : "Litecoin"} verificado!`);
        paymentSuccess = true;
      }
      
      if (paymentSuccess) {
        // Only add to order history if payment succeeded
        const success = await addToOrderHistory(cartItems);
        
        if (success) {
          toast.success("Pedido realizado com sucesso!");
          clearCart();
          navigate("/profile#games");
        } else {
          toast.error("Erro ao registrar pedido. Entre em contato com o suporte.");
        }
      } else {
        toast.error("Erro ao processar o pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Seu carrinho está vazio</CardTitle>
              <CardDescription>Adicione jogos ao carrinho para continuar.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/")} className="w-full">
                Voltar para a loja
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                  <CardDescription>
                    Verifique seus bilhetes antes de finalizar a compra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${item.color})` }}>
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleItemExpanded(item.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.logoSrc} 
                            alt={item.gameName} 
                            className="h-10 w-auto"
                          />
                          <div>
                            <h3 className="font-medium">{item.gameName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.lineCount} {item.lineCount === 1 ? 'bilhete' : 'bilhetes'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-4">R$ {item.price.toFixed(2)}</span>
                          <ChevronsUpDown size={16} className="text-muted-foreground" />
                        </div>
                      </div>
                      
                      {expandedItems[item.id] && (
                        <div className="px-4 pb-4 pt-2 border-t">
                          {item.lines && item.lines.map((line, idx) => (
                            <div key={idx} className="mb-3 last:mb-0">
                              <p className="text-sm text-muted-foreground mb-1">Bilhete {idx + 1}:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {line.numbers.map((num, i) => (
                                  <span 
                                    key={i} 
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-xs"
                                  >
                                    {num}
                                  </span>
                                ))}
                                
                                {line.powerball && (
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
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>
                    Escolha como você deseja pagar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        Saldo na Carteira
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bitcoin" id="bitcoin" />
                      <Label htmlFor="bitcoin" className="flex items-center">
                        <Bitcoin className="h-4 w-4 mr-2" />
                        Bitcoin
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="litecoin" id="litecoin" />
                      <Label htmlFor="litecoin" className="flex items-center">
                        <Coins className="h-4 w-4 mr-2" />
                        Litecoin
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="card-number">Número do Cartão</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Data de Validade</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="card-name">Nome no Cartão</Label>
                          <Input id="card-name" placeholder="Nome como está no cartão" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "wallet" && (
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <p className="text-center">Seu saldo atual: <span className="font-bold">{walletBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                      {total > walletBalance && (
                        <p className="text-center text-red-500 mt-2">
                          Saldo insuficiente. Faltam R$ {(total - walletBalance).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(paymentMethod === "bitcoin" || paymentMethod === "litecoin") && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="crypto-address">Seu endereço de {paymentMethod === "bitcoin" ? "Bitcoin" : "Litecoin"}</Label>
                        <Input 
                          id="crypto-address" 
                          placeholder={paymentMethod === "bitcoin" ? "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" : "LTC..."}
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Informe o endereço que será usado para verificar o pagamento
                        </p>
                      </div>
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="font-medium mb-2">Para finalizar o pagamento:</p>
                        <ol className="list-decimal list-inside text-sm space-y-1">
                          <li>Envie exatamente {total.toFixed(2)} BRL em {paymentMethod === "bitcoin" ? "Bitcoin" : "Litecoin"} para o endereço abaixo</li>
                          <li>Confirme seu pedido após realizar a transferência</li>
                        </ol>
                        <div className="mt-3 p-3 bg-gray-200 dark:bg-gray-700 rounded text-center break-all font-mono text-sm">
                          {paymentMethod === "bitcoin" 
                            ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                            : "ltc1qhw8w6q9j5zulc3rd892jgdpgvlkfqcs6q2m2aq"
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Order Total */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de serviço (10%)</span>
                    <span>R$ {serviceFee.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Cupom de desconto" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button 
                        onClick={handleApplyCoupon} 
                        variant="outline" 
                        disabled={!couponCode || isApplyingCoupon}
                      >
                        {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use o cupom "FIRST10" para obter 10% de desconto na sua primeira compra.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCompleteOrder} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={
                      (paymentMethod === "wallet" && total > walletBalance) || 
                      ((paymentMethod === "bitcoin" || paymentMethod === "litecoin") && !cryptoAddress) || 
                      isProcessing
                    }
                  >
                    {isProcessing ? "Processando..." : "Finalizar Compra"}
                    {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
