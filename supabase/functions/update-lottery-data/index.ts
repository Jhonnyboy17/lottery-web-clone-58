
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para obter a taxa de câmbio atual de USD para BRL
async function getExchangeRate() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    console.log('Exchange rate data:', data);
    
    if (data.rates && data.rates.BRL) {
      return data.rates.BRL;
    }
    // Fallback para uma taxa fixa caso a API falhe
    return 5.5;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 5.5; // Valor padrão caso a API falhe
  }
}

// Função simulada para obter dados de loterias
// Em produção, você substituiria isso por chamadas a APIs reais de loterias
async function getLotteryData() {
  // Esta é uma simulação - em produção você usaria APIs reais de loterias
  // Como exemplo: https://www.magayo.com/api/lottery.php
  const lotteryGames = [
    {
      game_name: 'Mega Millions',
      jackpot_amount: Math.floor(300000000 + Math.random() * 300000000).toString(),
      cash_option: Math.floor(150000000 + Math.random() * 100000000).toString(),
      next_drawing: `SEXTA, ${new Date().getDate() + 3} DE ${['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][new Date().getMonth()]}, 21:59 PM`,
      logo_src: '/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png'
    },
    {
      game_name: 'Powerball',
      jackpot_amount: Math.floor(350000000 + Math.random() * 400000000).toString(),
      cash_option: Math.floor(180000000 + Math.random() * 120000000).toString(),
      next_drawing: `SÁBADO, ${new Date().getDate() + 4} DE ${['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][new Date().getMonth()]}, 21:59 PM`,
      logo_src: '/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png'
    },
    {
      game_name: 'Lucky Day Lotto',
      jackpot_amount: Math.floor(500000 + Math.random() * 200000).toString(),
      cash_option: Math.floor(300000 + Math.random() * 100000).toString(),
      next_drawing: `SEGUNDA, ${new Date().getDate() + 1} DE ${['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][new Date().getMonth()]}, 21:59 PM`,
      logo_src: '/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png'
    },
    {
      game_name: 'Pick 4',
      jackpot_amount: '100000',
      cash_option: '',
      next_drawing: `SÁBADO, ${new Date().getDate() + 4} DE ${['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][new Date().getMonth()]}, 12:40 PM`,
      logo_src: '/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png'
    },
    {
      game_name: 'Cash 5',
      jackpot_amount: '5000',
      cash_option: '',
      next_drawing: 'TODOS OS DIAS 12:40 PM & 9:22 PM',
      logo_src: '/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png'
    },
    {
      game_name: 'Fast Play',
      jackpot_amount: '500',
      cash_option: '',
      next_drawing: 'TODOS OS DIAS 12:40 PM & 9:22 PM',
      logo_src: '/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png'
    },
  ];
  
  return lotteryGames;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar o cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter a taxa de câmbio atualizada
    const exchangeRate = await getExchangeRate();
    console.log(`Current exchange rate: USD 1 = BRL ${exchangeRate}`);

    // Obter dados atualizados das loterias
    const lotteryData = await getLotteryData();
    
    // Atualizar dados no banco de dados
    for (const game of lotteryData) {
      const { error } = await supabase
        .from('lottery_data')
        .update({ 
          jackpot_amount: game.jackpot_amount,
          cash_option: game.cash_option,
          next_drawing: game.next_drawing,
          exchange_rate: exchangeRate,
          last_updated: new Date().toISOString()
        })
        .eq('game_name', game.game_name);
      
      if (error) {
        console.error(`Error updating ${game.game_name}:`, error);
      } else {
        console.log(`Updated ${game.game_name} jackpot to $${game.jackpot_amount}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lottery data updated successfully',
        timestamp: new Date().toISOString(),
        exchangeRate
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in update-lottery-data function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
