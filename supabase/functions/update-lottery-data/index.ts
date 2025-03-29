
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Function to simulate fetching latest lottery data from an external API
// In a real implementation, this would call an actual lottery API
async function fetchLatestLotteryData() {
  console.log("Fetching latest lottery data");
  
  // This simulates the data we would get from a real API
  // In a production environment, replace with real API calls
  const currentDate = new Date();
  
  // Calculate next drawing dates
  const nextTuesday = new Date(currentDate);
  nextTuesday.setDate(currentDate.getDate() + ((9 - currentDate.getDay()) % 7));
  nextTuesday.setHours(21, 59, 0, 0);
  
  const nextSaturday = new Date(currentDate);
  nextSaturday.setDate(currentDate.getDate() + ((13 - currentDate.getDay()) % 7));
  nextSaturday.setHours(21, 59, 0, 0);
  
  // Format dates
  const formatDate = (date: Date) => {
    const days = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  };
  
  return [
    {
      game_name: "Mega Millions",
      jackpot_amount: "650,000,000",
      cash_option: "310.5 MILLION",
      next_drawing: formatDate(nextTuesday),
      logo_src: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png"
    },
    {
      game_name: "Powerball",
      jackpot_amount: "336,000,000",
      cash_option: "161.1 MILLION",
      next_drawing: formatDate(nextSaturday),
      logo_src: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png"
    },
    {
      game_name: "Lucky Day Lotto",
      jackpot_amount: "500,000",
      cash_option: "375 THOUSAND",
      next_drawing: "DIARIAMENTE, 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png"
    },
    {
      game_name: "Pick 4",
      jackpot_amount: "10,000",
      next_drawing: "DIARIAMENTE, 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png"
    },
    {
      game_name: "Cash 5",
      jackpot_amount: "100,000",
      next_drawing: "DIARIAMENTE 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png"
    },
    {
      game_name: "Fast Play",
      jackpot_amount: "50,000",
      next_drawing: "DIARIAMENTE 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png"
    }
  ];
}

// Update Supabase with the latest lottery data
async function updateLotteryData(supabase: any) {
  const lotteryData = await fetchLatestLotteryData();
  
  // Get current time for the update
  const now = new Date();
  
  for (const game of lotteryData) {
    const { data, error } = await supabase
      .from('lottery_data')
      .upsert({
        game_name: game.game_name,
        jackpot_amount: game.jackpot_amount,
        cash_option: game.cash_option,
        next_drawing: game.next_drawing,
        logo_src: game.logo_src,
        last_updated: now.toISOString()
      }, { onConflict: 'game_name' });
    
    if (error) {
      console.error(`Error updating ${game.game_name}:`, error);
    } else {
      console.log(`${game.game_name} updated successfully`);
    }
  }
  
  return { success: true, updatedAt: now.toISOString() };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Update lottery data in Supabase
    const result = await updateLotteryData(supabase);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in update-lottery-data function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
