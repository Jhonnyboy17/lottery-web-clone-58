
import { Json } from "@/integrations/supabase/types";

// Define the type for lottery results
export interface LotteryResult {
  id: string;
  game_type: string;
  draw_date: string;
  draw_number: number | null;
  numbers: number[];
  special_numbers?: number[] | null;
  multiplier?: string | null;
  jackpot_amount?: number | null;
  jackpot_winners?: number | null;
  next_jackpot_amount?: number | null;
  next_draw_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Make it type safe when fetching from Supabase
export type LotteryResultRow = {
  id: string;
  game_type: string;
  draw_date: string;
  draw_number: number | null;
  numbers: Json;
  special_numbers: Json | null;
  multiplier: string | null;
  jackpot_amount: number | null;
  jackpot_winners: number | null;
  next_jackpot_amount: number | null;
  next_draw_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Function to convert from database row to our application type
export const toLotteryResult = (row: LotteryResultRow): LotteryResult => {
  return {
    ...row,
    numbers: Array.isArray(row.numbers) ? row.numbers : [],
    special_numbers: Array.isArray(row.special_numbers) ? row.special_numbers : []
  };
};
