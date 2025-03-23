
export interface NumberSelectionType {
  digits: (number | null)[];
  playType: string;
  betAmount: string;
  includeFireball?: boolean;
  drawCount?: string;
}

export interface SavedLineType {
  numbers: number[];
  powerball: number | null;
  includeExtraPlay?: boolean;
  drawCount?: string;
  playType?: string;
  betAmount?: string;
}
