
import { useState } from "react";
import { useRapidApi } from "@/hooks/useRapidApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function RapidApiExample() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState({});
  
  // Exemplo usando a API de filmes IMDB
  const { data, loading, error, fetchData } = useRapidApi({
    host: "imdb8.p.rapidapi.com",
    endpoint: "/auto-complete"
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    
    fetchData({ q: query });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Exemplo de RapidAPI - Pesquisa IMDB</CardTitle>
          <CardDescription>
            Digite um nome de filme ou série para pesquisar informações usando a API do IMDB via RapidAPI
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite um nome de filme ou série..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pesquisar"}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {data && !loading && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resultados:</h3>
              
              {data.d && data.d.length > 0 ? (
                <div className="grid gap-4">
                  {data.d.map((item: any) => (
                    <div key={item.id} className="flex items-start p-4 border rounded-md">
                      {item.i && item.i.imageUrl && (
                        <img
                          src={item.i.imageUrl}
                          alt={item.l}
                          className="w-16 h-24 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <h4 className="font-bold">{item.l}</h4>
                        {item.y && <p className="text-gray-500">Ano: {item.y}</p>}
                        {item.s && <p className="text-sm">{item.s}</p>}
                        {item.qid && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {item.qid}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum resultado encontrado</p>
              )}
            </div>
          )}
          
          {loading && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-xs text-gray-500">Powered by RapidAPI</p>
          <Button variant="outline" onClick={() => window.open("https://rapidapi.com/marketplace", "_blank")}>
            Explorar mais APIs
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
