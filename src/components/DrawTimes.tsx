
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DrawTimeEntry {
  logo: string;
  logoAlt: string;
  drawTimes: {
    mon?: string;
    tue?: string;
    wed?: string;
    thu?: string;
    fri?: string;
    sat?: string;
    sun?: string;
    daily?: string;
  };
}

const lotteryDrawTimes: DrawTimeEntry[] = [
  {
    logo: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
    logoAlt: "Powerball Logo",
    drawTimes: {
      mon: "9:59 PM",
      wed: "9:59 PM",
      sat: "9:59 PM"
    }
  },
  {
    logo: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
    logoAlt: "Mega Millions Logo",
    drawTimes: {
      tue: "10:00 PM",
      fri: "10:00 PM"
    }
  },
  {
    logo: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
    logoAlt: "Lotto Logo",
    drawTimes: {
      mon: "9:22 PM",
      thu: "9:22 PM",
      sat: "9:22 PM"
    }
  },
  {
    logo: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
    logoAlt: "Lucky Day Lotto Logo",
    drawTimes: {
      daily: "DAILY"
    }
  },
  {
    logo: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
    logoAlt: "Pick 3 Logo",
    drawTimes: {
      daily: "DAILY AT\n12:40 PM & 9:22 PM"
    }
  },
  {
    logo: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png",
    logoAlt: "Pick 4 Logo",
    drawTimes: {
      daily: "DAILY"
    }
  }
];

const DrawTimes = () => {
  return (
    <Card className="bg-white dark:bg-lottery-dark-card rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-lottery-navy dark:text-white">
          Horários Dos Sorteios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="w-[100px] bg-gray-50 dark:bg-gray-800"></TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">SEG</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">TER</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">QUA</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">QUI</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">SEX</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">SÁB</TableHead>
                <TableHead className="text-center bg-gray-50 dark:bg-gray-800 font-medium">DOM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotteryDrawTimes.map((lottery, index) => {
                // Handle daily draw times differently
                if (lottery.drawTimes.daily) {
                  return (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                      <TableCell className="font-medium p-4 border-r border-gray-200 dark:border-gray-700">
                        <img 
                          src={lottery.logo} 
                          alt={lottery.logoAlt} 
                          className="h-10 object-contain"
                        />
                      </TableCell>
                      <TableCell 
                        className="text-center whitespace-pre-line border-r border-gray-200 dark:border-gray-700" 
                        colSpan={7}
                      >
                        {lottery.drawTimes.daily}
                      </TableCell>
                    </TableRow>
                  );
                }
                
                // Handle regular weekly draw times
                return (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <TableCell className="font-medium p-4 border-r border-gray-200 dark:border-gray-700">
                      <img 
                        src={lottery.logo} 
                        alt={lottery.logoAlt} 
                        className="h-10 object-contain"
                      />
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.mon || ""}</TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.tue || ""}</TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.wed || ""}</TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.thu || ""}</TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.fri || ""}</TableCell>
                    <TableCell className="text-center border-r border-gray-200 dark:border-gray-700">{lottery.drawTimes.sat || ""}</TableCell>
                    <TableCell className="text-center">{lottery.drawTimes.sun || ""}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawTimes;
