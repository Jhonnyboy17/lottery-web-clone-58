
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Duvidas = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-28 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            Tudo sobre as loterias na TheLotter
          </h1>

          {/* Introduction text */}
          <div className="max-w-4xl mx-auto mb-10 text-base text-gray-700 leading-relaxed">
            <p>
              Jogar na loteria é divertido. Você pode decidir <a href="#" className="text-blue-600 hover:underline">comprar bilhetes de loteria</a> porque deseja ganhar o jackpot ou porque fica 
              entusiasmado com a emoção que surge ao ficar na espera dos resultados dos sorteios. Seja qual for o motivo para jogar na
              loteria, esperamos que goste da nossa seleção de artigos e guias sobre o fascinante mundo lotérico. Inspire-se com as histórias
              dos nossos vencedores e descubra dicas e anedotas sobre como jogar na loteria. Quem sabe, você um dia se torna um vencedor
              do jackpot e terá sua própria história emocionante para contar!
            </p>
          </div>

          {/* Powerball Banner */}
          <div className="max-w-4xl mx-auto bg-red-500 rounded-md overflow-hidden mb-16">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0 bg-white rounded-full p-2 mr-4">
                <img 
                  src="/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png" 
                  alt="Powerball" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex-grow text-white">
                <span className="mr-2">US$</span>
                <span className="text-3xl font-bold">444</span>
                <span className="ml-2">milhões</span>
                <div className="text-sm mt-1">Data do sorteio: 22/03/2025</div>
              </div>
              <Link to="/play-powerball" className="flex-shrink-0">
                <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-8">
                  Jogar
                </Button>
              </Link>
            </div>
          </div>

          {/* Guides Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Guias para loterias
            </h2>
            <p className="text-gray-700 mb-10">
              Tudo o que você precisa saber para começar a jogar online nas loterias mundiais!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Guide 1 - Powerball */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-red-100 p-8 flex justify-center">
                  <div className="bg-white rounded-full p-3 w-28 h-28 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png" 
                      alt="Powerball" 
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Guia online mais completo para a Powerball EUA
                  </h3>
                  <p className="text-gray-700">
                    Leia nosso guia da Powerball e descubra tudo o que você sempre quis saber sobre a Powerball EUA, a maior loteria do mundo! Jackpots, estatísticas, chances de ganhar!
                  </p>
                </div>
              </div>

              {/* Guide 2 - Mega Millions */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-100 p-8 flex justify-center">
                  <div className="bg-white rounded-full p-3 w-28 h-28 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                      alt="Mega Millions" 
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    O guia mais completo para jogar na Mega Millions!
                  </h3>
                  <p className="text-gray-700">
                    A Mega Millions é sempre uma loteria emocionante. Aqui encontrará tudo o que você precisa saber sobre a segunda maior loteria multi-estadual dos EUA.
                  </p>
                </div>
              </div>

              {/* Guide 3 - EuroMilhões */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-yellow-100 p-8 flex justify-center">
                  <div className="bg-white rounded-full p-3 w-28 h-28 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/7e458cb6-6e89-4bc1-a022-660e40901ceb.png" 
                      alt="EuroMilhões" 
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    O melhor guia sobre como funciona EuroMilhões
                  </h3>
                  <p className="text-gray-700">
                    Os maiores jackpots do continente europeu. Temos todas as informações de que você precisa para obter uma vantagem competitiva ao jogar na mais famosa loteria!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row of Guides */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Guide 4 - Loterias Americanas */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/72beb89b-1a10-4018-a46a-0840357912a6.png" 
                  alt="Loterias Americanas" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    O guia informativo sobre as loterias americanas
                  </h3>
                  <p className="text-gray-700">
                    Os aficionados da loteria sabem que as loterias dos EUA reinam supremas quando se trata de jackpots! Confira este guia para aprender tudo sobre as loterias americanas e a história única da loteria dos EUA!
                  </p>
                </div>
              </div>

              {/* Guide 5 - Loterias do Japão */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/c1d30e34-79bc-4e99-aa69-b49e51afd87a.png" 
                  alt="Loterias do Japão" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Guia com todos os detalhes sobre as loterias do Japão
                  </h3>
                  <p className="text-gray-700">
                    As loterias japonesas estão se tornando cada dia mais populares no mundo inteiro, e na TheLotter você também pode se juntar à diversão! Leia nosso guia para saber como jogar e ganhar nas maiores loterias do Japão!
                  </p>
                </div>
              </div>

              {/* Guide 6 - EuroMilhões Jackpot */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                  alt="EuroMilhões Jackpot" 
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Tudo sobre o jackpot limite da loteria EuroMilhões
                  </h3>
                  <p className="text-gray-700">
                    O limite atual do jackpot da EuroMilhões é de € 240 milhões, mas como exatamente funciona o limite do jackpot? Surpreendentemente, o limite máximo do jackpot da EuroMilhões pode ficar ainda maior – saiba como!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row of Guides */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Guide 7 - Loterias Espanholas */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                  alt="Loterias Espanholas" 
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    O Guia Completo para Jogar Loterias Espanholas Online!
                  </h3>
                  <p className="text-gray-700">
                    A Espanha é o lar de algumas da mais emocionantes loterias e maiores prêmios do mundo, e agora você pode aprender tudo sobre como começar a jogar e ganhar, em nosso guia completo!
                  </p>
                </div>
              </div>

              {/* Guide 8 - Loterias Diárias */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/c1d30e34-79bc-4e99-aa69-b49e51afd87a.png" 
                  alt="Loterias Diárias" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Tudo sobre as loterias diárias na TheLotter
                  </h3>
                  <p className="text-gray-700">
                    Há novas loterias para jogar na TheLotter e todas elas têm algo em comum: sorteios diários! Essas emocionantes loterias têm ótimas probabilidades de ganho, e prêmios bastante interessantes!
                  </p>
                </div>
              </div>

              {/* Guide 9 - Loteria Australiana */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/72beb89b-1a10-4018-a46a-0840357912a6.png" 
                  alt="Loteria Australiana" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Manual da loteria australiana - tudo o que você precisa saber
                  </h3>
                  <p className="text-gray-700">
                    Os fãs da loteria gostarão de saber que as chances de ganhar são muito melhores na Austrália. Vale muito a pena jogar nas loterias australianas, e os prêmios oferecidos são isentos de impostos!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips and Stories Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Dicas e histórias ganhadoras
            </h2>
            <p className="text-gray-700 mb-10">
              Leia nossas dicas e conheça histórias fascinantes sobre as loterias!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Story 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                  alt="TheLotter é Segura" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Golpes lotéricos: a TheLotter é segura
                  </h3>
                  <p className="text-gray-700">
                    Se você não conhece nosso serviço ou ainda não comprou bilhetes de loteria no nosso site porque desconfia ou tem dúvidas, não se preocupe – a TheLotter sim é segura e com certeza não é golpe.
                  </p>
                </div>
              </div>

              {/* Story 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/c1d30e34-79bc-4e99-aa69-b49e51afd87a.png" 
                  alt="Histórias Lotéricas" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    6 histórias lotéricas: pessoas que foram da pobreza à riqueza
                  </h3>
                  <p className="text-gray-700">
                    Qualquer jogador na loteria sonha com tirar a grande sorte e levar uma bolada. Porém, alguns vencedores na loteria estavam realmente sem sorte antes que a vida desse um turno inesperado.
                  </p>
                </div>
              </div>

              {/* Story 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/72beb89b-1a10-4018-a46a-0840357912a6.png" 
                  alt="Ganhadores de Bolão" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Os maiores ganhadores de Bolão de Loteria que se deram supeer bem
                  </h3>
                  <p className="text-gray-700">
                    Pessoas do mundo inteiro apostaram juntas e ganharam super prêmios de várias loterias. Conheça histórias dos milionários vencedores de bolão da Mega Millions, Powerball, e de muitas outras loterias!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Row - More Guides */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Guide 10 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/72beb89b-1a10-4018-a46a-0840357912a6.png" 
                  alt="Dicas Powerball" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Como ganhar na Powerball: dicas para melhorar as chances
                  </h3>
                  <p className="text-gray-700">
                    Ganhar o jackpot da Powerball se tornou um dos objetivos principais de muitos jogadores do mundo inteiro. Veja algumas dicas que podem aumentar suas chances!
                  </p>
                </div>
              </div>

              {/* Guide 11 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/c1d30e34-79bc-4e99-aa69-b49e51afd87a.png" 
                  alt="Custo Powerball" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Quanto custa realmente um bilhete da Powerball?
                  </h3>
                  <p className="text-gray-700">
                    Um resumo de tudo que você precisa saber quando pagar pelo próximo bilhete da loteria Powerball dos EUA!
                  </p>
                </div>
              </div>

              {/* Guide 12 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                  alt="Pagamento Jackpot" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Pagamento fixo ou anuidades do jackpot Powerball – qual é a melhor?
                  </h3>
                  <p className="text-gray-700">
                    Eis um problema que todos gostaríamos de ter: como receber o pagamento do grande prêmio da loteria? Descubra as diferenças!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fifth Row - More Mega Millions Guides */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Guide 13 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/72beb89b-1a10-4018-a46a-0840357912a6.png" 
                  alt="Preço Mega Millions" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Mega Millions – qual o preço do bilhete?
                  </h3>
                  <p className="text-gray-700">
                    É fácil saber quanto custa um bilhete regular da loteria Mega Millions, mas quanto custará quando você jogar online ou adicionar o Megaplier? Leia nosso artigo para ver quanto custa tudo isso e como pode economizar!
                  </p>
                </div>
              </div>

              {/* Guide 14 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/c1d30e34-79bc-4e99-aa69-b49e51afd87a.png" 
                  alt="Pagamento Mega Millions" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Coletar o jackpot da Mega Millions: pagamento único ou anuidades?
                  </h3>
                  <p className="text-gray-700">
                    O valor final do jackpot que receberá depende se você aceitar o pagamento fixo em dinheiro ou se você optar por receber o prêmio pago em anuidades. Então, qual seria sua escolha?
                  </p>
                </div>
              </div>

              {/* Guide 15 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png" 
                  alt="Megaplier" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    O que é o Megaplier da Mega Millions?
                  </h3>
                  <p className="text-gray-700">
                    Ao marcar no seu bilhete a caixa do Megaplier, uma funcionalidade opcional, você tem a oportunidade de aumentar os prêmios secundários que poderia levar!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Duvidas;
