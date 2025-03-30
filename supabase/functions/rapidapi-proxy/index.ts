
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const rapidApiKey = Deno.env.get('RAPIDAPI_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { host, endpoint, params } = await req.json();
    
    if (!rapidApiKey) {
      throw new Error("RapidAPI key is not configured");
    }
    
    if (!host || !endpoint) {
      throw new Error("API host and endpoint are required");
    }
    
    console.log(`Making RapidAPI request to ${host}${endpoint}`);
    
    // Construct query string from params
    const queryParams = new URLSearchParams();
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `https://${host}${endpoint}?${queryString}` : `https://${host}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': host
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RapidAPI error: ${response.status} ${errorText}`);
      throw new Error(`RapidAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in RapidAPI proxy function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
