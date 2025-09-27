import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import logo from "@/assets/mycity-logo.png";

// Mock data for analytics
const monthlyData = [
  { month: 'Jan', complaints: 145, searches: 892, trends: 234 },
  { month: 'Feb', complaints: 167, searches: 1024, trends: 289 },
  { month: 'Mar', complaints: 189, searches: 1156, trends: 312 },
  { month: 'Apr', complaints: 203, searches: 1289, trends: 356 },
  { month: 'May', complaints: 178, searches: 1045, trends: 298 },
  { month: 'Jun', complaints: 234, searches: 1378, trends: 423 },
];

const searchCategoryData = [
  { name: 'Carian Umum', value: 35, color: '#3B82F6' },
  { name: 'Isu Trending', value: 28, color: '#06B6D4' },
  { name: 'Aduan', value: 22, color: '#8B5CF6' },
  { name: 'Perkhidmatan', value: 10, color: '#10B981' },
  { name: 'Lain-lain', value: 5, color: '#F59E0B' },
];

const trendingTopics = [
  { topic: 'Cara bayar cukai tanah online', count: 156, trend: 'up', change: '+24%', type: 'search' },
  { topic: 'Lubang jalan raya Cyberjaya', count: 89, trend: 'up', change: '+12%', type: 'complaint' },
  { topic: 'Permohonan lesen perniagaan', count: 78, trend: 'up', change: '+18%', type: 'search' },
  { topic: 'Masalah lampu jalan Cybersouth', count: 67, trend: 'up', change: '+8%', type: 'issue' },
  { topic: 'Jadual pengumpulan sampah', count: 54, trend: 'down', change: '-5%', type: 'search' },
];

const districtData = [
  { 
    id: 'cyberjaya-central', 
    name: 'Cyberjaya Central', 
    issues: 45, 
    popular: 'Infrastruktur jalan',
    topTrends: [
      'Lubang jalan raya besar',
      'Lampu jalan rosak',
      'Penggunaan bot telegram',
      'Kemudahan parking',
      'Keselamatan malam hari'
    ]
  },
  { 
    id: 'cybersouth', 
    name: 'Cybersouth', 
    issues: 32, 
    popular: 'Kebersihan kawasan',
    topTrends: [
      'Pengumpulan sampah lewat',
      'Kawasan taman kotor',
      'Longkang tersumbat',
      'Masalah anjing liar',
      'Vandalisme dinding'
    ]
  },
  { 
    id: 'cyberjaya-north', 
    name: 'Cyberjaya North', 
    issues: 28, 
    popular: 'Keselamatan',
    topTrends: [
      'Pecah rumah berlaku',
      'Lampu jalan gelap',
      'Kawasan sunyi malam',
      'CCTV tidak berfungsi',
      'Patrol polis kurang'
    ]
  },
  { 
    id: 'cyberjaya-west', 
    name: 'Cyberjaya West', 
    issues: 21, 
    popular: 'Pengangkutan awam',
    topTrends: [
      'Bas lewat tiba',
      'Stesen LRT jauh',
      'Tiada bas malam',
      'Tambang Grab mahal',
      'Parking kereta penuh'
    ]
  },
  { 
    id: 'cyberjaya-east', 
    name: 'Cyberjaya East', 
    issues: 19, 
    popular: 'Kemudahan awam',
    topTrends: [
      'Tandas awam kotor',
      'Tiada tempat duduk',
      'Wifi awam lemah',
      'ATM selalu rosak',
      'Taman permainan rosak'
    ]
  },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getDistrictColor = (issues: number) => {
    if (issues > 40) return 'hsl(var(--destructive))';
    if (issues > 25) return 'hsl(var(--primary))';
    return 'hsl(142, 76%, 36%)'; // Green for low issues
  };

  const hoveredData = hoveredDistrict ? districtData.find(d => d.id === hoveredDistrict) : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-analytics)' }}>
      {/* Navigation Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="MyCity AI" className="w-10 h-10 rounded-lg shadow-lg" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Analisis aduan dan carian warganegara Cyberjaya</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Kembali ke Utama
          </Button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 p-4 md:p-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Jumlah Carian</CardTitle>
              <Users className="h-4 w-4 text-cyan-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7,784</div>
              <p className="text-xs text-cyan-200">+8% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Aduan Aktif</CardTitle>
              <MessageSquare className="h-4 w-4 text-cyan-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,316</div>
              <p className="text-xs text-cyan-200">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Isu Kritikal</CardTitle>
              <AlertTriangle className="h-4 w-4 text-cyan-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">23</div>
              <p className="text-xs text-cyan-200">Memerlukan tindakan segera</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Kadar Penyelesaian</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">87%</div>
              <p className="text-xs text-cyan-200">+3% dari bulan lalu</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Monthly Trends */}
          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader>
              <CardTitle className="text-white">Trend Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="month" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="searches" stroke="#06B6D4" strokeWidth={3} name="Carian" />
                  <Line type="monotone" dataKey="complaints" stroke="#8B5CF6" strokeWidth={3} name="Aduan" />
                  <Line type="monotone" dataKey="trends" stroke="#10B981" strokeWidth={3} name="Trending" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader>
              <CardTitle className="text-white">Kategori Carian & Aktiviti</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={searchCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {searchCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics and Map */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Trending Topics */}
          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader>
              <CardTitle className="text-white">Aktiviti Popular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="flex-1">
                      <p className="font-medium text-white">{topic.topic}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-cyan-200">{topic.count} aktiviti</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            topic.type === 'search' ? 'bg-blue-500/20 text-blue-200 border-blue-400' :
                            topic.type === 'complaint' ? 'bg-purple-500/20 text-purple-200 border-purple-400' :
                            'bg-green-500/20 text-green-200 border-green-400'
                          }`}
                        >
                          {topic.type === 'search' ? 'Carian' : topic.type === 'complaint' ? 'Aduan' : 'Isu'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={topic.trend === 'up' ? 'default' : 'secondary'} className="bg-cyan-500/20 text-cyan-200">
                        {topic.change}
                      </Badge>
                      {topic.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cyberjaya District Map */}
          <Card className="border-0 shadow-lg" style={{ background: 'var(--gradient-analytics-card)', backdropFilter: 'blur(10px)' }}>
            <CardHeader>
              <CardTitle className="text-white">Peta Isu Mengikut Daerah</CardTitle>
              <p className="text-sm text-cyan-200">Hover pada daerah untuk maklumat lanjut</p>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-visible">
                <svg viewBox="0 0 400 300" className="w-full h-48 md:h-64 border rounded-lg">
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
                  <text x="100" y="85" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">
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
                  <text x="220" y="85" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">
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
                  <text x="100" y="165" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">
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
                  <text x="220" y="165" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">
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
                  <text x="320" y="115" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">
                    East
                  </text>
                </svg>

                {/* Hover Details */}
                {hoveredData && (
                  <div className="absolute top-2 right-2 bg-black/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-cyan-400/30 max-w-xs z-50 min-w-[280px]">
                    <h4 className="font-semibold text-white text-lg mb-2">{hoveredData.name}</h4>
                    <p className="text-sm text-cyan-200 mb-2">{hoveredData.issues} isu aktif</p>
                    <p className="text-sm text-white mb-3">Isu popular: <span className="font-medium text-cyan-300">{hoveredData.popular}</span></p>
                    <div className="border-t border-cyan-400/20 pt-3">
                      <h5 className="text-sm font-medium text-cyan-300 mb-2">Top 5 Trending:</h5>
                      <ul className="space-y-1">
                        {hoveredData.topTrends.map((trend, index) => (
                          <li key={index} className="text-xs text-white flex items-center">
                            <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] flex items-center justify-center mr-2 font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="leading-tight">{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-4 flex items-center space-x-4 text-sm text-white flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }}></div>
                    <span>Tinggi (40+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                    <span>Sederhana (25-40)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></div>
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