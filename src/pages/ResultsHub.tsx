
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, CalendarDays, ArrowRight, FileText, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Game {
  id: number;
  name: string;
  logo: string;
  date: string;
  numbers: string[];
  specialNumbers?: string[];
  multiplier?: string;
}

interface MegaMillionsResult {
  drawDate: string;
  displayDate: string;
  dayOfWeek: string;
  numbers: string[];
  megaBall: string;
  multiplier: string;
  jackpot?: string;
}

interface PowerballResult {
  drawDate: string;
  displayDate: string;
  dayOfWeek: string;
  numbers: string[];
  powerball: string;
  multiplier: string;
  jackpot?: string;
}

interface LuckyDayResult {
  drawDate: string;
  displayDate: string;
  dayOfWeek: string;
  numbers: string[];
  bonusNumber: string;
  lottoMillion1: string[];
  lottoMillion2: string[];
}

const megaMillionsHistory: MegaMillionsResult[] = [
  {
    drawDate: "03/21/2025",
    displayDate: "21 de março de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["15", "22", "31", "52", "57"],
    megaBall: "2",
    multiplier: "x3"
  },
  {
    drawDate: "03/18/2025",
    displayDate: "18 de março de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["27", "28", "31", "32", "33"],
    megaBall: "24",
    multiplier: "x3"
  },
  {
    drawDate: "03/14/2025",
    displayDate: "14 de março de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["3", "17", "39", "42", "70"],
    megaBall: "1",
    multiplier: "x3"
  },
  {
    drawDate: "03/11/2025",
    displayDate: "11 de março de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["1", "19", "26", "38", "69"],
    megaBall: "15",
    multiplier: "x3"
  },
  {
    drawDate: "03/07/2025",
    displayDate: "7 de março de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["8", "20", "48", "58", "60"],
    megaBall: "7",
    multiplier: "x3"
  },
  {
    drawDate: "03/04/2025",
    displayDate: "4 de março de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["14", "19", "47", "52", "70"],
    megaBall: "6",
    multiplier: "x2"
  },
  {
    drawDate: "02/28/2025",
    displayDate: "28 de fevereiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["9", "19", "30", "35", "66"],
    megaBall: "16",
    multiplier: "x3"
  },
  {
    drawDate: "02/25/2025",
    displayDate: "25 de fevereiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["4", "8", "11", "32", "52"],
    megaBall: "13",
    multiplier: "x2"
  },
  {
    drawDate: "02/21/2025",
    displayDate: "21 de fevereiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["1", "13", "28", "37", "46"],
    megaBall: "10",
    multiplier: "x2"
  },
  {
    drawDate: "02/18/2025",
    displayDate: "18 de fevereiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["1", "20", "25", "58", "61"],
    megaBall: "22",
    multiplier: "x2"
  },
  {
    drawDate: "02/14/2025",
    displayDate: "14 de fevereiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["11", "19", "31", "49", "56"],
    megaBall: "16",
    multiplier: "x3"
  },
  {
    drawDate: "02/11/2025",
    displayDate: "11 de fevereiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["7", "30", "39", "41", "70"],
    megaBall: "13",
    multiplier: "x3"
  },
  {
    drawDate: "02/07/2025",
    displayDate: "7 de fevereiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["10", "23", "32", "43", "65"],
    megaBall: "3",
    multiplier: "x2"
  },
  {
    drawDate: "02/04/2025",
    displayDate: "4 de fevereiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["2", "14", "30", "40", "58"],
    megaBall: "12",
    multiplier: "x4"
  },
  {
    drawDate: "01/31/2025",
    displayDate: "31 de janeiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["5", "10", "15", "20", "25"],
    megaBall: "5",
    multiplier: "x3"
  },
  {
    drawDate: "01/28/2025",
    displayDate: "28 de janeiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["12", "24", "37", "58", "60"],
    megaBall: "6",
    multiplier: "x2"
  },
  {
    drawDate: "01/24/2025",
    displayDate: "24 de janeiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["1", "4", "23", "40", "45"],
    megaBall: "11",
    multiplier: "x3"
  },
  {
    drawDate: "01/21/2025",
    displayDate: "21 de janeiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["9", "12", "17", "48", "68"],
    megaBall: "8",
    multiplier: "x2"
  },
  {
    drawDate: "01/17/2025",
    displayDate: "17 de janeiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["3", "16", "21", "61", "62"],
    megaBall: "19",
    multiplier: "x4"
  },
  {
    drawDate: "01/14/2025",
    displayDate: "14 de janeiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["6", "15", "24", "34", "55"],
    megaBall: "7",
    multiplier: "x3"
  },
  {
    drawDate: "01/10/2025",
    displayDate: "10 de janeiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["2", "11", "20", "32", "65"],
    megaBall: "23",
    multiplier: "x3"
  },
  {
    drawDate: "01/07/2025",
    displayDate: "7 de janeiro de 2025",
    dayOfWeek: "Terça-feira",
    numbers: ["4", "22", "33", "44", "50"],
    megaBall: "12",
    multiplier: "x2"
  },
  {
    drawDate: "01/03/2025",
    displayDate: "3 de janeiro de 2025",
    dayOfWeek: "Sexta-feira",
    numbers: ["10", "15", "20", "30", "55"],
    megaBall: "10",
    multiplier: "x2"
  },
  {
    drawDate: "12/31/2024",
    displayDate: "31 de dezembro de 2024",
    dayOfWeek: "Terça-feira",
    numbers: ["5", "14", "28", "31", "40"],
    megaBall: "2",
    multiplier: "x3"
  },
  {
    drawDate: "12/27/2024",
    displayDate: "27 de dezembro de 2024",
    dayOfWeek: "Sexta-feira",
    numbers: ["8", "19", "25", "36", "59"],
    megaBall: "7",
    multiplier: "x3"
  },
  {
    drawDate: "12/24/2024",
    displayDate: "24 de dezembro de 2024",
    dayOfWeek: "Terça-feira",
    numbers: ["3", "6", "34", "53", "60"],
    megaBall: "10",
    multiplier: "x2"
  },
  {
    drawDate: "12/20/2024",
    displayDate: "20 de dezembro de 2024",
    dayOfWeek: "Sexta-feira",
    numbers: ["11", "13", "26", "50", "65"],
    megaBall: "15",
    multiplier: "x2"
  },
  {
    drawDate: "12/17/2024",
    displayDate: "17 de dezembro de 2024",
    dayOfWeek: "Terça-feira",
    numbers: ["9", "10", "25", "38", "50"],
    megaBall: "5",
    multiplier: "x4"
  }
];

const powerballHistory: PowerballResult[] = [
  {
    drawDate: "03/24/2025",
    displayDate: "24 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["6", "23", "35", "36", "47"],
    powerball: "12",
    multiplier: "x2"
  },
  {
    drawDate: "03/22/2025",
    displayDate: "22 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["6", "7", "25", "46", "57"],
    powerball: "12",
    multiplier: "x3"
  },
  {
    drawDate: "03/19/2025",
    displayDate: "19 de março de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["8", "11", "21", "49", "59"],
    powerball: "15",
    multiplier: "x2"
  },
  {
    drawDate: "03/17/2025",
    displayDate: "17 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["11", "18", "23", "38", "60"],
    powerball: "9",
    multiplier: "x2"
  },
  {
    drawDate: "03/15/2025",
    displayDate: "15 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["12", "28", "33", "36", "54"],
    powerball: "5",
    multiplier: "x3"
  },
  {
    drawDate: "03/12/2025",
    displayDate: "12 de março de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["11", "13", "28", "51", "58"],
    powerball: "1",
    multiplier: "x2"
  },
  {
    drawDate: "03/10/2025",
    displayDate: "10 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["17", "40", "47", "50", "55"],
    powerball: "6",
    multiplier: "x2"
  },
  {
    drawDate: "03/08/2025",
    displayDate: "8 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["2", "4", "16", "23", "63"],
    powerball: "13",
    multiplier: "x3"
  },
  {
    drawDate: "03/05/2025",
    displayDate: "5 de março de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["24", "28", "40", "63", "65"],
    powerball: "20",
    multiplier: "x3"
  },
  {
    drawDate: "03/03/2025",
    displayDate: "3 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["18", "20", "50", "52", "56"],
    powerball: "20",
    multiplier: "x2"
  },
  {
    drawDate: "03/01/2025",
    displayDate: "1 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["3", "8", "40", "53", "58"],
    powerball: "3",
    multiplier: "x3"
  },
  {
    drawDate: "02/26/2025",
    displayDate: "26 de fevereiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["4", "27", "42", "50", "60"],
    powerball: "13",
    multiplier: "x3"
  },
  {
    drawDate: "02/24/2025",
    displayDate: "24 de fevereiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["1", "22", "30", "42", "47"],
    powerball: "23",
    multiplier: "x2"
  },
  {
    drawDate: "02/22/2025",
    displayDate: "22 de fevereiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["2", "3", "19", "40", "69"],
    powerball: "9",
    multiplier: "x3"
  },
  {
    drawDate: "02/19/2025",
    displayDate: "19 de fevereiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["1", "4", "45", "47", "67"],
    powerball: "18",
    multiplier: "x2"
  },
  {
    drawDate: "02/17/2025",
    displayDate: "17 de fevereiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["5", "6", "24", "32", "43"],
    powerball: "1",
    multiplier: "x2"
  },
  {
    drawDate: "02/15/2025",
    displayDate: "15 de fevereiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["10", "17", "19", "44", "45"],
    powerball: "2",
    multiplier: "x2"
  },
  {
    drawDate: "02/12/2025",
    displayDate: "12 de fevereiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["25", "30", "52", "54", "67"],
    powerball: "24",
    multiplier: "x2"
  },
  {
    drawDate: "02/10/2025",
    displayDate: "10 de fevereiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["16", "26", "31", "60", "61"],
    powerball: "23",
    multiplier: "x2"
  },
  {
    drawDate: "02/08/2025",
    displayDate: "8 de fevereiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["2", "9", "36", "53", "63"],
    powerball: "11",
    multiplier: "x2"
  },
  {
    drawDate: "02/05/2025",
    displayDate: "5 de fevereiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["5", "9", "27", "39", "42"],
    powerball: "16",
    multiplier: "x2"
  },
  {
    drawDate: "02/03/2025",
    displayDate: "3 de fevereiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["6", "9", "13", "29", "66"],
    powerball: "24",
    multiplier: "x2"
  },
  {
    drawDate: "02/01/2025",
    displayDate: "1 de fevereiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["6", "16", "31", "62", "66"],
    powerball: "18",
    multiplier: "x2"
  },
  {
    drawDate: "01/29/2025",
    displayDate: "29 de janeiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["6", "8", "19", "23", "26"],
    powerball: "5",
    multiplier: "x2"
  },
  {
    drawDate: "01/27/2025",
    displayDate: "27 de janeiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["1", "2", "5", "13", "29"],
    powerball: "25",
    multiplier: "x3"
  },
  {
    drawDate: "01/25/2025",
    displayDate: "25 de janeiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["24", "26", "39", "47", "57"],
    powerball: "19",
    multiplier: "x3"
  },
  {
    drawDate: "01/22/2025",
    displayDate: "22 de janeiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["1", "5", "12", "13", "58"],
    powerball: "21",
    multiplier: "x2"
  },
  {
    drawDate: "01/20/2025",
    displayDate: "20 de janeiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["7", "10", "11", "44", "67"],
    powerball: "2",
    multiplier: "x2"
  },
  {
    drawDate: "01/18/2025",
    displayDate: "18 de janeiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["14", "20", "23", "39", "67"],
    powerball: "2",
    multiplier: "x3"
  },
  {
    drawDate: "01/15/2025",
    displayDate: "15 de janeiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["1", "9", "10", "35", "44"],
    powerball: "18",
    multiplier: "x2"
  },
  {
    drawDate: "01/13/2025",
    displayDate: "13 de janeiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["7", "17", "27", "39", "42"],
    powerball: "6",
    multiplier: "x2"
  },
  {
    drawDate: "01/11/2025",
    displayDate: "11 de janeiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["4", "6", "14", "20", "32"],
    powerball: "17",
    multiplier: "x2"
  },
  {
    drawDate: "01/08/2025",
    displayDate: "8 de janeiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["12", "21", "42", "44", "49"],
    powerball: "1",
    multiplier: "x3"
  },
  {
    drawDate: "01/06/2025",
    displayDate: "6 de janeiro de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["2", "11", "22", "35", "60"],
    powerball: "23",
    multiplier: "x2"
  },
  {
    drawDate: "01/04/2025",
    displayDate: "4 de janeiro de 2025",
    dayOfWeek: "Sábado",
    numbers: ["12", "21", "42", "44", "49"],
    powerball: "1",
    multiplier: "x3"
  },
  {
    drawDate: "01/01/2025",
    displayDate: "1 de janeiro de 2025",
    dayOfWeek: "Quarta-feira",
    numbers: ["12", "21", "42", "44", "49"],
    powerball: "1",
    multiplier: "x3"
  },
  {
    drawDate: "12/30/2024",
    displayDate: "30 de dezembro de 2024",
    dayOfWeek: "Segunda-feira",
    numbers: ["17", "35", "46", "54", "67"],
    powerball: "8",
    multiplier: "x2"
  },
  {
    drawDate: "12/27/2024",
    displayDate: "27 de dezembro de 2024",
    dayOfWeek: "Sexta-feira",
    numbers: ["10", "11", "26", "27", "34"],
    powerball: "7",
    multiplier: "x2"
  },
  {
    drawDate: "12/25/2024",
    displayDate: "25 de dezembro de 2024",
    dayOfWeek: "Quarta-feira",
    numbers: ["14", "17", "18", "21", "27"],
    powerball: "9",
    multiplier: "x3"
  },
  {
    drawDate: "12/23/2024",
    displayDate: "23 de dezembro de 2024",
    dayOfWeek: "Segunda-feira",
    numbers: ["1", "13", "33", "44", "56"],
    powerball: "9",
    multiplier: "x2"
  },
  {
    drawDate: "12/20/2024",
    displayDate: "20 de dezembro de 2024",
    dayOfWeek: "Sexta-feira",
    numbers: ["3", "7", "33", "50", "69"],
    powerball: "24",
    multiplier: "x3"
  },
  {
    drawDate: "12/18/2024",
    displayDate: "18 de dezembro de 2024",
    dayOfWeek: "Quarta-feira",
    numbers: ["2", "4", "21", "38", "50"],
    powerball: "10",
    multiplier: "x2"
  },
  {
    drawDate: "12/16/2024",
    displayDate: "16 de dezembro de 2024",
    dayOfWeek: "Segunda-feira",
    numbers: ["8", "12", "23", "26", "30"],
    powerball: "11",
    multiplier: "x2"
  }
];

const gamesData: Game[] = [
  {
    id: 1,
    name: "Mega Millions",
    logo: "/lovable-uploads/bc3feaa6-86f8-46cb-b245-5467ab0e5fb4.png",
    date: "Friday, Mar 22, 2024",
    numbers: ["15", "25", "31", "52", "67"],
    specialNumbers: ["9"],
    multiplier: "3X"
  },
  {
    id: 2,
    name: "Powerball",
    logo: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
    date: "Wednesday, Mar 20, 2024",
    numbers: ["8", "11", "21", "49", "59"],
    specialNumbers: ["15"],
    multiplier: "2X"
  },
  {
    id: 3,
    name: "Lucky Day Lotto",
    logo: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
    date: "Segunda, Mar 24, 2024",
    numbers: ["3", "24", "27", "34", "38"]
  },
  {
    id: 4,
    name: "Pick 4",
    logo: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
    date: "Sábado, Mar 22, 2024",
    numbers: ["7", "0", "5", "3"],
    specialNumbers: ["7"]
  },
  {
    id: 5,
    name: "Cash 5",
    logo: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
    date: "Sábado, Mar 22, 2024",
    numbers: ["6", "12", "13", "20", "29"]
  },
  {
    id: 6,
    name: "Fast Play",
    logo: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png",
    date: "Todos os dias",
    numbers: ["02", "14", "26", "33", "40"]
  },
];

const luckyDayHistory: LuckyDayResult[] = [
  {
    drawDate: "03/24/2025",
    displayDate: "24 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["9", "13", "16", "31", "36", "42"],
    bonusNumber: "21",
    lottoMillion1: ["12", "25", "30", "32", "34", "42"],
    lottoMillion2: ["1", "4", "11", "29", "42", "49"]
  },
  {
    drawDate: "03/22/2025",
    displayDate: "22 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["11", "20", "24", "27", "39", "48"],
    bonusNumber: "12",
    lottoMillion1: ["3", "8", "25", "28", "38", "40"],
    lottoMillion2: ["11", "16", "18", "21", "24", "43"]
  },
  {
    drawDate: "03/20/2025",
    displayDate: "20 de março de 2025",
    dayOfWeek: "Quinta-feira",
    numbers: ["6", "12", "13", "20", "29", "31"],
    bonusNumber: "15",
    lottoMillion1: ["9", "14", "21", "25", "38", "43"],
    lottoMillion2: ["2", "12", "14", "17", "39", "44"]
  },
  {
    drawDate: "03/17/2025",
    displayDate: "17 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["21", "22", "26", "29", "42", "49"],
    bonusNumber: "4",
    lottoMillion1: ["6", "14", "17", "36", "40", "44"],
    lottoMillion2: ["2", "5", "9", "14", "21", "48"]
  },
  {
    drawDate: "03/15/2025",
    displayDate: "15 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["1", "8", "26", "36", "43", "49"],
    bonusNumber: "5",
    lottoMillion1: ["1", "9", "11", "24", "39", "49"],
    lottoMillion2: ["31", "34", "36", "38", "43", "44"]
  },
  {
    drawDate: "03/13/2025",
    displayDate: "13 de março de 2025",
    dayOfWeek: "Quinta-feira",
    numbers: ["6", "20", "31", "32", "38", "45"],
    bonusNumber: "16",
    lottoMillion1: ["13", "17", "24", "33", "37", "39"],
    lottoMillion2: ["2", "8", "11", "13", "29", "32"]
  },
  {
    drawDate: "03/10/2025",
    displayDate: "10 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["20", "22", "28", "29", "32", "48"],
    bonusNumber: "2",
    lottoMillion1: ["16", "22", "40", "41", "44", "47"],
    lottoMillion2: ["1", "5", "14", "31", "45", "46"]
  },
  {
    drawDate: "03/08/2025",
    displayDate: "8 de março de 2025",
    dayOfWeek: "Sábado",
    numbers: ["3", "5", "18", "22", "40", "44"],
    bonusNumber: "16",
    lottoMillion1: ["1", "11", "17", "35", "44", "46"],
    lottoMillion2: ["3", "5", "19", "26", "35", "39"]
  },
  {
    drawDate: "03/06/2025",
    displayDate: "6 de março de 2025",
    dayOfWeek: "Quinta-feira",
    numbers: ["14", "22", "25", "26", "28", "37"],
    bonusNumber: "8",
    lottoMillion1: ["3", "11", "15", "23", "28", "37"],
    lottoMillion2: ["2", "29", "38", "41", "42", "49"]
  },
  {
    drawDate: "03/03/2025",
    displayDate: "3 de março de 2025",
    dayOfWeek: "Segunda-feira",
    numbers: ["9", "17", "25", "43", "45", "46"],
    bonusNumber: "11",
    lottoMillion1: ["1", "23", "30", "33", "41", "43"],
    lottoMillion2: ["4", "31", "42", "44", "45", "50"]
  }
];

const ResultsHub = () => {
  const [activeTab, setActiveTab] = useState("all-games");
  const [currentPage, setCurrentPage] = useState(1);
  const [megaMillionsPage, setMegaMillionsPage] = useState(1);
  const [powerballPage, setPowerballPage] = useState(1);
  const [luckyDayPage, setLuckyDayPage] = useState(1);
  
  const gamesPerPage = 5;
  const megaMillionsResultsPerPage = 5;
  const powerballResultsPerPage = 10;
  const luckyDayResultsPerPage = 5;
  
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gamesData.slice(indexOfFirstGame, indexOfLastGame);
  
  const indexOfLastMegaMillionsResult = megaMillionsPage * megaMillionsResultsPerPage;
  const indexOfFirstMegaMillionsResult = indexOfLastMegaMillionsResult - megaMillionsResultsPerPage;
  const currentMegaMillionsResults = megaMillionsHistory.slice(
    indexOfFirstMegaMillionsResult, 
    indexOfLastMegaMillionsResult
  );
  
  const indexOfLastPowerballResult = powerballPage * powerballResultsPerPage;
  const indexOfFirstPowerballResult = indexOfLastPowerballResult - powerballResultsPerPage;
  const currentPowerballResults = powerballHistory.slice(
    indexOfFirstPowerballResult, 
    indexOfLastPowerballResult
  );
  
  const indexOfLastLuckyDayResult = luckyDayPage * luckyDayResultsPerPage;
  const indexOfFirstLuckyDayResult = indexOfLastLuckyDayResult - luckyDayResultsPerPage;
  const currentLuckyDayResults = luckyDayHistory.slice(
    indexOfFirstLuckyDayResult, 
    indexOfLastLuckyDayResult
  );
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const paginateMegaMillions = (pageNumber: number) => setMegaMillionsPage(pageNumber);
  const paginatePowerball = (pageNumber: number) => setPowerballPage(pageNumber);
  const paginateLuckyDay = (pageNumber: number) => setLuckyDayPage(pageNumber);
  
  useEffect(() => {
    if (activeTab === "mega-millions") {
      setMegaMillionsPage(1);
    } else if (activeTab === "powerball") {
      setPowerballPage(1);
    } else if (activeTab === "lucky-day") {
      setLuckyDayPage(1);
    } else if (activeTab === "all-games") {
      setCurrentPage(1);
    }
  }, [activeTab]);
  
  const getGameColor = (gameName: string) => {
    switch (gameName) {
      case "Mega Millions":
        return "bg-blue-500";
      case "Powerball":
        return "bg-[#ff5247]";
      case "Lucky Day Lotto":
        return "bg-[#8CD444]";
      case "Pick 4":
        return "bg-[#00ccc6]";
      case "Cash 5":
      case "Fast Play":
        return "bg-[#ffa039]";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-28 text-white">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="text-purple-200 hover:text-white flex items-center mr-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white">Results Hub</h1>
        </div>
        
        <Card className="mb-10 bg-purple-800 border-purple-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="pl-10 pr-4 py-2 w-full bg-purple-700 border border-purple-600 text-white placeholder-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lottery-pink"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex items-center justify-center bg-purple-700 border-purple-600 text-white hover:bg-purple-600">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button className="bg-lottery-pink hover:bg-lottery-pink/90 text-white">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all-games" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-3/4 bg-purple-800 p-1">
            <TabsTrigger value="all-games" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              All Games
            </TabsTrigger>
            <TabsTrigger value="mega-millions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Mega Millions
            </TabsTrigger>
            <TabsTrigger value="powerball" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Powerball
            </TabsTrigger>
            <TabsTrigger value="lucky-day" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Lucky Day
            </TabsTrigger>
            <TabsTrigger value="pick4" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Pick 4
            </TabsTrigger>
            <TabsTrigger value="cash5" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Cash 5
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-games" className="mt-6">
            <div className="bg-purple-800 p-6 rounded-lg shadow-sm mb-6 border border-purple-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Draw Results - All Games
                  </h3>
                  <p className="text-purple-300">
                    Results for all lottery games
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <Button variant="outline" className="flex items-center bg-purple-700 border-purple-600 text-white hover:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentGames.map((game, index) => (
                  <div key={index} className="border border-purple-600 bg-purple-700 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                      <div className="flex items-center">
                        <img src={game.logo} alt={game.name} className="h-10 w-auto mr-3" />
                        <div>
                          <h4 className="text-lg font-bold text-white">{game.name}</h4>
                          <p className="text-purple-300 text-sm">{game.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-purple-300 p-0 h-auto hover:bg-transparent hover:text-white mt-2 md:mt-0">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {game.numbers.map((number, idx) => (
                        <span 
                          key={idx} 
                          className={`${getGameColor(game.name)} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {number}
                        </span>
                      ))}
                      {game.specialNumbers?.map((number, idx) => (
                        <span 
                          key={`special-${idx}`} 
                          className="bg-amber-400 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm"
                        >
                          {number}
                        </span>
                      ))}
                      {game.multiplier && (
                        <span className="ml-2 text-sm font-medium text-purple-300">
                          {game.multiplier}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) paginate(currentPage - 1);
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(gamesData.length / gamesPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(index + 1);
                        }}
                        className={currentPage === index + 1 
                          ? "bg-purple-600 text-white" 
                          : "bg-purple-700 border-purple-600 text-white hover:bg-purple-600"}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < Math.ceil(gamesData.length / gamesPerPage)) {
                          paginate(currentPage + 1);
                        }
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-8 text-sm text-purple-300">
                <p>Fonte: <a href="https://www.illinoislottery.com/results" className="text-lottery-pink hover:underline" target="_blank" rel="noopener noreferrer">Illinois Lottery</a></p>
                <p className="mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mega-millions" className="mt-6">
            <div className="bg-purple-800 p-6 rounded-lg shadow-sm mb-6 border border-purple-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Draw Results Mega Millions
                  </h3>
                  <p className="text-purple-300">
                    Click for more details on the prize payouts
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <img 
                    src="/lovable-uploads/bc3feaa6-86f8-46cb-b245-5467ab0e5fb4.png" 
                    alt="Mega Millions Logo" 
                    className="h-12 w-auto mr-4"
                  />
                  <Button variant="outline" className="flex items-center bg-purple-700 border-purple-600 text-white hover:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentMegaMillionsResults.map((result, index) => (
                  <div key={index} className="border border-purple-600 bg-purple-700 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{result.dayOfWeek}</h4>
                        <p className="text-purple-300 text-sm">{result.displayDate}</p>
                      </div>
                      <Button variant="ghost" className="text-purple-300 p-0 h-auto hover:bg-transparent hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result.numbers.map((number, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-900 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        >
                          {number}
                        </span>
                      ))}
                      <span className="bg-amber-400 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {result.megaBall}
                      </span>
                      <span className="ml-2 text-sm text-purple-300">
                        {result.multiplier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (megaMillionsPage > 1) paginateMegaMillions(megaMillionsPage - 1);
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(megaMillionsHistory.length / megaMillionsResultsPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={megaMillionsPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginateMegaMillions(index + 1);
                        }}
                        className={megaMillionsPage === index + 1 
                          ? "bg-purple-600 text-white" 
                          : "bg-purple-700 border-purple-600 text-white hover:bg-purple-600"}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (megaMillionsPage < Math.ceil(megaMillionsHistory.length / megaMillionsResultsPerPage)) {
                          paginateMegaMillions(megaMillionsPage + 1);
                        }
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-8 text-sm text-purple-300">
                <p>Fonte: <a href="https://www.illinoislottery.com/dbg/results/megamillions" className="text-lottery-pink hover:underline" target="_blank" rel="noopener noreferrer">Illinois Lottery</a></p>
                <p className="mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <Card className="bg-purple-700 border-purple-600">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-white mb-3">Como Jogar na Mega Millions</h4>
                <p className="text-purple-200 mb-4">
                  O sorteio da Mega Millions ocorre todas as terças e sextas-feiras. Para jogar:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-purple-200">
                  <li>Escolha 5 números de 1 a 70</li>
                  <li>Escolha 1 número Mega Ball de 1 a 25</li>
                  <li>Opcionalmente, adicione o Megaplier para multiplicar seus prêmios (exceto o jackpot)</li>
                  <li>Cada jogo custa R$ 15</li>
                </ol>
                <div className="mt-6">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Jogar Mega Millions Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="powerball" className="mt-6">
            <div className="bg-purple-800 p-6 rounded-lg shadow-sm mb-6 border border-purple-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Draw Results Powerball
                  </h3>
                  <p className="text-purple-300">
                    Click for more details on the prize payouts
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <img 
                    src="/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png" 
                    alt="Powerball Logo" 
                    className="h-12 w-auto mr-4"
                  />
                  <Button variant="outline" className="flex items-center bg-purple-700 border-purple-600 text-white hover:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentPowerballResults.map((result, index) => (
                  <div key={index} className="border border-purple-600 bg-purple-700 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{result.dayOfWeek}</h4>
                        <p className="text-purple-300 text-sm">{result.displayDate}</p>
                      </div>
                      <Button variant="ghost" className="text-purple-300 p-0 h-auto hover:bg-transparent hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result.numbers.map((number, idx) => (
                        <span 
                          key={idx} 
                          className="bg-[#ff5247] w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        >
                          {number}
                        </span>
                      ))}
                      <span className="bg-amber-400 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {result.powerball}
                      </span>
                      <span className="ml-2 text-sm text-purple-300">
                        {result.multiplier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (powerballPage > 1) paginatePowerball(powerballPage - 1);
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(powerballHistory.length / powerballResultsPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={powerballPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginatePowerball(index + 1);
                        }}
                        className={powerballPage === index + 1 
                          ? "bg-purple-600 text-white" 
                          : "bg-purple-700 border-purple-600 text-white hover:bg-purple-600"}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (powerballPage < Math.ceil(powerballHistory.length / powerballResultsPerPage)) {
                          paginatePowerball(powerballPage + 1);
                        }
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-8 text-sm text-purple-300">
                <p>Fonte: <a href="https://www.illinoislottery.com/dbg/results/powerball" className="text-lottery-pink hover:underline" target="_blank" rel="noopener noreferrer">Illinois Lottery</a></p>
                <p className="mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <Card className="bg-purple-700 border-purple-600">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-white mb-3">Como Jogar na Powerball</h4>
                <p className="text-purple-200 mb-4">
                  O sorteio da Powerball ocorre segundas, quartas e sábados. Para jogar:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-purple-200">
                  <li>Escolha 5 números de 1 a 69</li>
                  <li>Escolha 1 número Powerball de 1 a 26</li>
                  <li>Opcionalmente, adicione o Power Play para multiplicar seus prêmios (exceto o jackpot)</li>
                  <li>Cada jogo custa R$ 15</li>
                </ol>
                <div className="mt-6">
                  <Button className="bg-[#ff5247] hover:bg-[#ff5247]/90 text-white">
                    Jogar Powerball Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lucky-day" className="mt-6">
            <div className="bg-purple-800 p-6 rounded-lg shadow-sm mb-6 border border-purple-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Draw Results Lucky Day Lotto
                  </h3>
                  <p className="text-purple-300">
                    Click for more details on the prize payouts
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <img 
                    src="/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png" 
                    alt="Lucky Day Logo" 
                    className="h-12 w-auto mr-4"
                  />
                  <Button variant="outline" className="flex items-center bg-purple-700 border-purple-600 text-white hover:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentLuckyDayResults.map((result, index) => (
                  <div key={index} className="border border-purple-600 bg-purple-700 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{result.dayOfWeek}</h4>
                        <p className="text-purple-300 text-sm">{result.displayDate}</p>
                      </div>
                      <Button variant="ghost" className="text-purple-300 p-0 h-auto hover:bg-transparent hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {result.numbers.map((number, idx) => (
                        <span 
                          key={idx} 
                          className="bg-[#8CD444] w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        >
                          {number}
                        </span>
                      ))}
                      <span className="bg-amber-500 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {result.bonusNumber}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-600 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white mb-2">LOTTO MILLION 1</p>
                        <div className="flex flex-wrap gap-2">
                          {result.lottoMillion1.map((val, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-full bg-[#c2e190] text-gray-800 flex items-center justify-center font-bold text-sm"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white mb-2">LOTTO MILLION 2</p>
                        <div className="flex flex-wrap gap-2">
                          {result.lottoMillion2.map((val, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-full bg-[#c2e190] text-gray-800 flex items-center justify-center font-bold text-sm"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (luckyDayPage > 1) paginateLuckyDay(luckyDayPage - 1);
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(luckyDayHistory.length / luckyDayResultsPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={luckyDayPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginateLuckyDay(index + 1);
                        }}
                        className={luckyDayPage === index + 1 
                          ? "bg-purple-600 text-white" 
                          : "bg-purple-700 border-purple-600 text-white hover:bg-purple-600"}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (luckyDayPage < Math.ceil(luckyDayHistory.length / luckyDayResultsPerPage)) {
                          paginateLuckyDay(luckyDayPage + 1);
                        }
                      }}
                      className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-8 text-sm text-purple-300">
                <p>Fonte: <a href="https://www.illinoislottery.com/dbg/results/luckydaylotto" className="text-lottery-pink hover:underline" target="_blank" rel="noopener noreferrer">Illinois Lottery</a></p>
                <p className="mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <Card className="bg-purple-700 border-purple-600">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-white mb-3">Como Jogar no Lucky Day Lotto</h4>
                <p className="text-purple-200 mb-4">
                  O sorteio do Lucky Day Lotto ocorre duas vezes por dia. Para jogar:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-purple-200">
                  <li>Escolha 5 números de 1 a 45</li>
                  <li>Opcionalmente, adicione o Lucky Boost para aumentar seus prêmios</li>
                  <li>Cada jogo custa R$ 15</li>
                </ol>
                <div className="mt-6">
                  <Button className="bg-[#8CD444] hover:bg-[#8CD444]/90 text-white">
                    Jogar Lucky Day Lotto Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {["pick4", "cash5"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="bg-purple-800 p-6 rounded-lg shadow-sm border border-purple-700">
                <h3 className="text-xl font-bold text-center text-white mb-4">
                  {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Results
                </h3>
                <p className="text-center text-purple-300">
                  Showing filtered results for {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsHub;
