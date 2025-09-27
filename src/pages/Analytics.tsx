import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data for analytics
const monthlyData = [
  { month: 'Jan', complaints: 145, searches: 892 },
  { month: 'Feb', complaints: 167, searches: 1024 },
  { month: 'Mar', complaints: 189, searches: 1156 },
  { month: 'Apr', complaints: 203, searches: 1289 },
  { month: 'May', complaints: 178, searches: 1045 },
  { month: 'Jun', complaints: 234, searches: 1378 },
];

const categoryData = [
  { name: 'Infrastruktur', value: 34, color: 'hsl(var(--primary))' },
  { name: 'Kebersihan', value: 28, color: 'hsl(var(--secondary))' },
  { name: 'Keselamatan', value: 19, color: 'hsl(var(--accent))' },
  { name: 'Pengangkutan', value: 12, color: 'hsl(var(--muted))' },
  { name: 'Lain-lain', value: 7, color: 'hsl(var(--destructive))' },
];

const trendingTopics = [
  { topic: 'Lubang jalan raya', count: 89, trend: 'up', change: '+12%' },
  { topic: 'Masalah lampu jalan', count: 67, trend: 'up', change: '+8%' },
  { topic: 'Pengumpulan sampah', count: 54, trend: 'down', change: '-5%' },
  { topic: 'Kemudahan awam', count: 43, trend: 'up', change: '+15%' },
  { topic: 'Gangguan banjir', count: 32, trend: 'down', change: '-3%' },
];

const districtData = [
  { id: 'cyberjaya-central', name: 'Cyberjaya Central', issues: 45, popular: 'Infrastruktur jalan' },
  { id: 'cybersouth', name: 'Cybersouth', issues: 32, popular: 'Kebersihan kawasan' },
  { id: 'cyberjaya-north', name: 'Cyberjaya North', issues: 28, popular: 'Keselamatan' },
  { id: 'cyberjaya-west', name: 'Cyberjaya West', issues: 21, popular: 'Pengangkutan awam' },
  { id: 'cyberjaya-east', name: 'Cyberjaya East', issues: 19, popular: 'Kemudahan awam' },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getDistrictColor = (issues: number) => {
    if (issues > 40) return 'hsl(var(--destructive))';
    if (issues > 25) return 'hsl(var(--primary))';
    return 'hsl(var(--secondary))';
  };

  const hoveredData = hoveredDistrict ? districtData.find(d => d.id === hoveredDistrict) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Analisis aduan dan carian warganegara Cyberjaya</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Kembali ke Utama
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah Aduan</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,316</div>
              <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carian Aktif</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,784</div>
              <p className="text-xs text-muted-foreground">+8% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Isu Kritikal</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Memerlukan tindakan segera</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kadar Penyelesaian</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+3% dari bulan lalu</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Trend Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="hsl(var(--primary))" name="Aduan" />
                  <Line type="monotone" dataKey="searches" stroke="hsl(var(--secondary))" name="Carian" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Kategori Aduan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Topics */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Topik Trending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{topic.topic}</p>
                      <p className="text-sm text-muted-foreground">{topic.count} aduan</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={topic.trend === 'up' ? 'default' : 'secondary'}>
                        {topic.change}
                      </Badge>
                      {topic.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cyberjaya District Map */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Peta Isu Mengikut Daerah</CardTitle>
              <p className="text-sm text-muted-foreground">Hover pada daerah untuk maklumat lanjut</p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <svg viewBox="0 0 400 300" className="w-full h-64 border rounded-lg">
                  {/* Simplified Cyberjaya districts */}
                  <path
                    d="M50 50 L150 50 L150 120 L50 120 Z"
                    fill={getDistrictColor(45)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredDistrict('cyberjaya-central')}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  />
                  <text x="100" y="85" textAnchor="middle" className="fill-white text-xs font-medium">
                    Central
                  </text>

                  <path
                    d="M160 50 L280 50 L280 120 L160 120 Z"
                    fill={getDistrictColor(32)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredDistrict('cybersouth')}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  />
                  <text x="220" y="85" textAnchor="middle" className="fill-white text-xs font-medium">
                    Cybersouth
                  </text>

                  <path
                    d="M50 130 L150 130 L150 200 L50 200 Z"
                    fill={getDistrictColor(28)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredDistrict('cyberjaya-north')}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  />
                  <text x="100" y="165" textAnchor="middle" className="fill-white text-xs font-medium">
                    North
                  </text>

                  <path
                    d="M160 130 L280 130 L280 200 L160 200 Z"
                    fill={getDistrictColor(21)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredDistrict('cyberjaya-west')}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  />
                  <text x="220" y="165" textAnchor="middle" className="fill-white text-xs font-medium">
                    West
                  </text>

                  <path
                    d="M290 80 L350 80 L350 150 L290 150 Z"
                    fill={getDistrictColor(19)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredDistrict('cyberjaya-east')}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  />
                  <text x="320" y="115" textAnchor="middle" className="fill-white text-xs font-medium">
                    East
                  </text>
                </svg>

                {/* Hover Details */}
                {hoveredData && (
                  <div className="absolute top-4 right-4 bg-background/95 p-3 rounded-lg shadow-lg border">
                    <h4 className="font-semibold">{hoveredData.name}</h4>
                    <p className="text-sm text-muted-foreground">{hoveredData.issues} isu aktif</p>
                    <p className="text-sm">Isu popular: <span className="font-medium">{hoveredData.popular}</span></p>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-destructive"></div>
                    <span>Tinggi (40+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span>Sederhana (25-40)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-secondary"></div>
                    <span>Rendah (&lt;25)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;