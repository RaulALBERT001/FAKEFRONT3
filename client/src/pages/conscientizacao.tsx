import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, Leaf, Zap, Droplets, Recycle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const renewableEnergyData = [
  { year: '2022', solar: 191, eolica: 899, hidreletrica: 1355, total: 2445 },
  { year: '2023', solar: 235, eolica: 906, hidreletrica: 1356, total: 2497 },
  { year: '2024', solar: 290, eolica: 1021, hidreletrica: 1365, total: 2676 }
];

const energySourcesData = [
  { name: 'Solar', value: 23.2, color: '#f59e0b' },
  { name: 'Eólica', value: 9.8, color: '#10b981' },
  { name: 'Hidrelétrica', value: 15.0, color: '#3b82f6' },
  { name: 'Outras Renováveis', value: 6.0, color: '#8b5cf6' },
  { name: 'Não Renováveis', value: 46.0, color: '#ef4444' }
];

interface StatisticsCardProps {
  title: string;
  value: string;
  explanation: string;
  source: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

function StatisticsCard({ title, value, explanation, source, icon, trend }: StatisticsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          {trend && (
            <Badge variant={trend === 'up' ? 'default' : 'destructive'}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {trend === 'up' ? 'Crescimento' : 'Declínio'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <p className="text-sm text-gray-600 mb-3">{explanation}</p>
        <p className="text-xs text-gray-500 italic">Fonte: {source}</p>
      </CardContent>
    </Card>
  );
}

export default function ConsientizacaoPage() {
  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-600">
          Sustentabilidade Global: Uma Urgência Planetária
        </h1>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          O futuro do nosso planeta depende das ações que tomamos hoje. Enfrentamos uma crise ambiental sem precedentes, 
          mas também vivemos um momento de transformação energética histórica. Descubra como cada gesto conta na construção 
          de um mundo mais sustentável.
        </p>
      </div>

      {/* Urgência Ambiental */}
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-800">Urgência Climática</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 leading-relaxed">
            Estamos vivendo uma emergência climática real. As temperaturas globais continuam subindo, 
            eventos climáticos extremos se intensificam, e ecossistemas inteiros estão em risco. 
            O tempo para reverter essa trajetória está se esgotando rapidamente, mas ainda há esperança 
            se agirmos com determinação e urgência.
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatisticsCard
          title="Crescimento de Energia Renovável"
          value="50%"
          explanation="Em 2023, a capacidade global de energia renovável cresceu 50%, com acréscimo de 510 GW — o maior aumento em 20 anos"
          source="IRENA, 2024"
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          trend="up"
        />
        
        <StatisticsCard
          title="Participação das Renováveis"
          value="30%"
          explanation="As fontes renováveis passaram a gerar 30% da eletricidade mundial em 2023 (solar +23,2%, eólica +9,8%)"
          source="Reuters, 2024"
          icon={<Leaf className="h-5 w-5 text-green-500" />}
          trend="up"
        />
        
        <StatisticsCard
          title="Energia Hidrelétrica"
          value="15%"
          explanation="Responsável por cerca de 15% da eletricidade global em 2023, com produção próxima a 4.210 TWh"
          source="Wikipedia, 2024"
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
        />
        
        <StatisticsCard
          title="Dia da Sobrecarga da Terra"
          value="1° de Agosto"
          explanation="Em 2024, ultrapassamos os limites anuais do planeta, utilizando recursos 1,7 vezes mais rápido do que ele pode regenerar"
          source="WWF, Geneva Environment Network"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          trend="down"
        />
        
        <StatisticsCard
          title="Velocidade de Consumo"
          value="1,7x"
          explanation="Estamos consumindo os recursos naturais do planeta 1,7 vezes mais rápido do que sua capacidade de regeneração"
          source="My Climate, WWF"
          icon={<Recycle className="h-5 w-5 text-orange-500" />}
          trend="down"
        />
        
        <StatisticsCard
          title="Meta do Acordo de Paris"
          value="1,5°C"
          explanation="Limite de aquecimento global estabelecido para evitar os piores impactos das mudanças climáticas"
          source="Acordo de Paris, 2015"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Gráfico de Evolução */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Energia Renovável (2022-2024)</CardTitle>
            <p className="text-sm text-gray-600">Capacidade instalada em GW</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={renewableEnergyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solar" fill="#f59e0b" name="Solar" />
                <Bar dataKey="eolica" fill="#10b981" name="Eólica" />
                <Bar dataKey="hidreletrica" fill="#3b82f6" name="Hidrelétrica" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matriz Energética Mundial 2023</CardTitle>
            <p className="text-sm text-gray-600">Participação por fonte (%)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energySourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {energySourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Dados Detalhados */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Revolução Energética</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>2023 foi um ano histórico para as energias renováveis:</strong>
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Energia solar cresceu 23,2%, adicionando 235 GW de capacidade</li>
              <li>• Energia eólica expandiu 9,8%, com 77 GW de nova capacidade</li>
              <li>• China liderou com 63% de toda nova capacidade renovável global</li>
              <li>• Investimentos em renováveis atingiram US$ 1,8 trilhão</li>
              <li>• Custos da energia solar caíram 85% na última década</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Desafios Urgentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>Apesar do progresso, enfrentamos desafios críticos:</strong>
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Emissões de CO2 ainda 70% acima dos níveis de 1990</li>
              <li>• Necessidade de triplicar capacidade renovável até 2030</li>
              <li>• 733 milhões de pessoas ainda sem acesso à eletricidade</li>
              <li>• Perda de biodiversidade acelera com mudanças climáticas</li>
              <li>• Eventos climáticos extremos custaram US$ 90 bi em 2023</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chamada para Ação */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800 mb-4">
            Seja Parte da Solução
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-green-700 leading-relaxed max-w-3xl mx-auto">
            Cada ação individual contribui para a transformação global. Pequenas mudanças 
            em nossos hábitos diários podem gerar impactos significativos quando multiplicadas 
            por milhões de pessoas comprometidas com a sustentabilidade.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Economize Água</h3>
              <p className="text-sm text-green-600">Reduza banhos e conserte vazamentos</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Use Energia Limpa</h3>
              <p className="text-sm text-green-600">Escolha fornecedores de energia renovável</p>
            </div>
            <div className="text-center">
              <Recycle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Pratique os 3 Rs</h3>
              <p className="text-sm text-green-600">Reduza, Reutilize e Recicle sempre</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Comece Seus Desafios Sustentáveis
            </Button>
            <p className="text-sm text-green-600">
              Participe dos nossos desafios e quiz para aprender mais sobre sustentabilidade
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}