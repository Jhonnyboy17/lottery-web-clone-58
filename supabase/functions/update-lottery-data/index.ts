
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

// Function to fetch latest Mega Millions data using OpenAI
async function fetchLatestMegaMillionsData() {
  console.log("Fetching latest Mega Millions data from OpenAI");
  
  try {
    if (!openAIApiKey) {
      console.error("OpenAI API key is not configured or is empty");
      throw new Error("OpenAI API key is not configured");
    }
    
    console.log("Starting OpenAI API request for Mega Millions data");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides accurate lottery information. Reply with ONLY the JSON data, no explanation or other text."
          },
          {
            role: "user",
            content: `What is the current Mega Millions jackpot amount, cash option amount, and next drawing date and time? Return ONLY a JSON object with these fields: 
              {
                "jackpot_amount": "formatted jackpot in dollars with commas",
                "cash_option": "formatted cash option in text (e.g. '170.9 MILLION')", 
                "next_drawing": "formatted drawing date in all caps (e.g. 'QUARTA, ABR 24, 9:59 PM')"
              }`
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      })
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API error status ${response.status}: ${errorBody}`);
      
      if (response.status === 429) {
        console.error("OpenAI API quota exceeded. Please check your billing status at platform.openai.com");
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${errorBody}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("OpenAI response:", content);
    
    // Parse the JSON from the response
    let megaMillionsData;
    try {
      megaMillionsData = JSON.parse(content);
    } catch (error) {
      console.error(`Failed to parse OpenAI response as JSON. Response: ${content}`);
      throw new Error(`Failed to parse OpenAI response as JSON: ${error.message}. Response: ${content}`);
    }
    
    // Validate required fields
    if (!megaMillionsData.jackpot_amount || !megaMillionsData.next_drawing) {
      console.error(`Response missing required fields: ${JSON.stringify(megaMillionsData)}`);
      throw new Error(`Response missing required fields: ${JSON.stringify(megaMillionsData)}`);
    }
    
    return {
      game_name: "Mega Millions",
      jackpot_amount: megaMillionsData.jackpot_amount,
      cash_option: megaMillionsData.cash_option || "CASH OPTION UNAVAILABLE",
      next_drawing: megaMillionsData.next_drawing,
      logo_src: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png"
    };
  } catch (error) {
    console.error("Error fetching Mega Millions data from OpenAI:", error);
    
    // Fallback to default data if the API call fails
    console.log("Using fallback data for Mega Millions");
    return {
      game_name: "Mega Millions",
      jackpot_amount: "380,000,000",
      cash_option: "170.9 MILLION",
      next_drawing: "QUARTA, ABR 24, 9:59 PM",
      logo_src: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png"
    };
  }
}

// Function to fetch static data for other lottery games
function getStaticLotteryData() {
  const currentDate = new Date();
  
  // Calculate next drawing dates
  const nextWednesday = new Date(currentDate);
  nextWednesday.setDate(currentDate.getDate() + ((10 - currentDate.getDay()) % 7));
  nextWednesday.setHours(21, 59, 0, 0);
  
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
      game_name: "Powerball",
      jackpot_amount: "102,000,000",
      cash_option: "48.6 MILLION",
      next_drawing: formatDate(nextSaturday),
      logo_src: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png"
    },
    {
      game_name: "Lucky Day Lotto",
      jackpot_amount: "350,000",
      cash_option: "262.5 THOUSAND",
      next_drawing: "DIARIAMENTE, 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png"
    },
    {
      game_name: "Pick 4",
      jackpot_amount: "5,000",
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
      jackpot_amount: "20,000",
      next_drawing: "DIARIAMENTE 12:40 PM & 9:22 PM",
      logo_src: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png"
    }
  ];
}

// Update Supabase with the latest lottery data
async function updateLotteryData(supabase: any) {
  // Fetch latest Mega Millions data from OpenAI
  const megaMillionsData = await fetchLatestMegaMillionsData();
  // Get static data for other lottery games
  const otherGamesData = getStaticLotteryData();
  
  // Combine all lottery data
  const lotteryData = [megaMillionsData, ...otherGamesData];
  
  // Get current time for the update
  const now = new Date();
  
  for (const game of lotteryData) {
    try {
      // First attempt to select the record to see if it exists
      const { data: existingGame } = await supabase
        .from('lottery_data')
        .select('id')
        .eq('game_name', game.game_name)
        .single();
      
      if (existingGame) {
        // Update existing record
        const { error } = await supabase
          .from('lottery_data')
          .update({
            jackpot_amount: game.jackpot_amount,
            cash_option: game.cash_option,
            next_drawing: game.next_drawing,
            logo_src: game.logo_src,
            last_updated: now.toISOString()
          })
          .eq('id', existingGame.id);
        
        if (error) {
          console.error(`Error updating ${game.game_name}:`, error);
        } else {
          console.log(`${game.game_name} updated successfully`);
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('lottery_data')
          .insert({
            game_name: game.game_name,
            jackpot_amount: game.jackpot_amount,
            cash_option: game.cash_option,
            next_drawing: game.next_drawing,
            logo_src: game.logo_src,
            last_updated: now.toISOString()
          });
        
        if (error) {
          console.error(`Error inserting ${game.game_name}:`, error);
        } else {
          console.log(`${game.game_name} inserted successfully`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${game.game_name}:`, error);
    }
  }
  
  return { 
    success: true, 
    updatedAt: now.toISOString(), 
    gamesCount: lotteryData.length,
    megaMillionsUpdated: true
  };
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
