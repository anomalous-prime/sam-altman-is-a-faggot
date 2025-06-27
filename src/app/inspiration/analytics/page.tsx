'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Database, 
  FileText, 
  TreePine, 
  Users, 
  Clock, 
  HardDrive,
  Eye,
  Edit,
  Plus,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  AreaChart, 
  BarChart as RechartsBarChart, 
  PieChart as RechartsPieChart,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  Bar,
  Line,
  Pie
} from 'recharts';

// Mock Data Generators
const generateTimeSeriesData = (days: number, baseValue: number, variance: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
      timestamp: date.getTime()
    });
  }
  return data;
};

const generateHourlyData = (hours: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    
    data.push({
      hour: date.getHours(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      events: Math.floor(Math.random() * 150) + 20,
      errors: Math.floor(Math.random() * 10),
      success: Math.floor(Math.random() * 140) + 30
    });
  }
  return data;
};

// Mock data
const mockData = {
  // Real-time metrics
  realTimeStats: {
    activeUsers: 127,
    eventsPerSecond: 45,
    avgResponseTime: 120,
    errorRate: 0.02,
    totalClusters: 234,
    totalAreas: 1456,
    totalTags: 89,
    totalArtifacts: 2847
  },

  // Cluster hierarchy data
  clusterHierarchy: [
    { level: 0, count: 12, name: 'Root Clusters' },
    { level: 1, count: 45, name: 'Level 1' },
    { level: 2, count: 128, name: 'Level 2' },
    { level: 3, count: 89, name: 'Level 3' },
    { level: 4, count: 34, name: 'Level 4' },
    { level: 5, count: 8, name: 'Level 5' }
  ],

  // Tag usage distribution
  tagUsage: [
    { name: 'javascript', value: 245, color: '#F7DF1E' },
    { name: 'react', value: 189, color: '#61DAFB' },
    { name: 'frontend', value: 156, color: '#8B5CF6' },
    { name: 'backend', value: 134, color: '#6366F1' },
    { name: 'database', value: 98, color: '#10B981' },
    { name: 'api', value: 87, color: '#3B82F6' },
    { name: 'testing', value: 76, color: '#EC4899' },
    { name: 'deployment', value: 65, color: '#F59E0B' },
    { name: 'security', value: 54, color: '#EF4444' },
    { name: 'performance', value: 43, color: '#06B6D4' }
  ],

  // Activity timeline
  activityTimeline: generateTimeSeriesData(30, 150, 50).map(d => ({
    ...d,
    areas: Math.floor(d.value * 0.3),
    clusters: Math.floor(d.value * 0.15),
    tags: Math.floor(d.value * 0.25),
    artifacts: Math.floor(d.value * 0.4)
  })),

  // Event bus activity
  eventBusActivity: generateHourlyData(24),

  // Performance metrics
  performanceMetrics: generateTimeSeriesData(7, 100, 20).map(d => ({
    ...d,
    responseTime: Math.max(50, d.value + Math.random() * 50),
    throughput: Math.max(10, d.value * 2 + Math.random() * 100),
    errorRate: Math.max(0, Math.random() * 5)
  })),

  // Content distribution
  contentDistribution: [
    { name: 'Documentation', value: 1247, color: '#06B6D4', icon: FileText },
    { name: 'Code Artifacts', value: 856, color: '#8B5CF6', icon: Database },
    { name: 'Images', value: 445, color: '#10B981', icon: Eye },
    { name: 'Videos', value: 234, color: '#F59E0B', icon: Activity },
    { name: 'Other', value: 178, color: '#6B7280', icon: HardDrive }
  ],

  // Top clusters by activity
  topClusters: [
    { name: 'Web Development', areas: 234, activity: 89, growth: 12 },
    { name: 'Data Science', areas: 189, activity: 67, growth: 8 },
    { name: 'Machine Learning', areas: 156, activity: 78, growth: 15 },
    { name: 'Cloud Infrastructure', areas: 134, activity: 45, growth: 5 },
    { name: 'Mobile Development', areas: 98, activity: 56, growth: -2 },
    { name: 'DevOps', areas: 87, activity: 34, growth: 7 }
  ],

  // System health
  systemHealth: {
    natsCluster: { status: 'healthy', latency: 12, throughput: '45K/s' },
    database: { status: 'healthy', connections: 45, queryTime: 23 },
    cache: { status: 'warning', hitRate: 89, memory: 78 },
    api: { status: 'healthy', requests: '12.4K/min', errors: 0.1 }
  },

  // Recent activity feed
  recentActivity: [
    { type: 'create', entity: 'cluster', name: 'Microservices Architecture', user: 'Alice Chen', time: '2 min ago', icon: Plus },
    { type: 'update', entity: 'area', name: 'React Hooks Guide', user: 'Bob Smith', time: '5 min ago', icon: Edit },
    { type: 'delete', entity: 'tag', name: 'deprecated-api', user: 'Carol Wong', time: '8 min ago', icon: Trash2 },
    { type: 'create', entity: 'artifact', name: 'Authentication Service', user: 'David Lee', time: '12 min ago', icon: Plus },
    { type: 'update', entity: 'cluster', name: 'Frontend Framework', user: 'Eve Johnson', time: '15 min ago', icon: Edit },
    { type: 'create', entity: 'area', name: 'GraphQL Best Practices', user: 'Frank Wilson', time: '18 min ago', icon: Plus }
  ]
};

// Components
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}> = ({ title, value, change, icon: Icon, color, subtitle }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl border border-opacity-30 backdrop-blur-sm p-4 relative overflow-hidden`}>
    <div className="flex items-center justify-between relative z-10">
      <div className="flex-1">
        <p className="text-sm text-slate-300 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-slate-300 mt-1">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-xs ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <Icon className="w-8 h-8 text-white opacity-80" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
  </div>
);

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, subtitle, children, actions }) => (
  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const StatusIndicator: React.FC<{ status: 'healthy' | 'warning' | 'error' }> = ({ status }) => {
  const colors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };
  
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
  };
  
  const Icon = icons[status];
  
  return <Icon className={`w-4 h-4 ${colors[status]}`} />;
};

const TaxonomyStatsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState(mockData.realTimeStats);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 10),
        eventsPerSecond: Math.max(0, prev.eventsPerSecond + Math.floor((Math.random() - 0.5) * 20)),
        avgResponseTime: Math.max(50, prev.avgResponseTime + Math.floor((Math.random() - 0.5) * 30))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getTimeRangeData = () => {
    switch (timeRange) {
      case '24h':
        return mockData.eventBusActivity;
      case '7d':
        return mockData.performanceMetrics;
      case '30d':
        return mockData.activityTimeline;
      default:
        return mockData.activityTimeline;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Real-time insights into your taxonomy ecosystem</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
              {(['24h', '7d', '30d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    timeRange === range 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Users"
          value={realTimeMetrics.activeUsers}
          change={8}
          icon={Users}
          color="from-indigo-500/20 to-purple-500/20 border-indigo-400"
        />
        <MetricCard
          title="Events/Second"
          value={realTimeMetrics.eventsPerSecond}
          change={12}
          icon={Zap}
          color="from-cyan-500/20 to-blue-500/20 border-cyan-400"
        />
        <MetricCard
          title="Response Time"
          value={`${realTimeMetrics.avgResponseTime}ms`}
          change={-5}
          icon={Clock}
          color="from-emerald-500/20 to-green-500/20 border-emerald-400"
        />
        <MetricCard
          title="Error Rate"
          value={`${(realTimeMetrics.errorRate * 100).toFixed(2)}%`}
          change={-15}
          icon={AlertTriangle}
          color="from-orange-500/20 to-red-500/20 border-orange-400"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Timeline */}
        <ChartCard
          title="Activity Timeline"
          subtitle="Entity creation and updates over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData.activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="areas" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="clusters" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
              <Area type="monotone" dataKey="tags" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="artifacts" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Event Bus Activity */}
        <ChartCard
          title="NATS Event Bus Activity"
          subtitle="Real-time message processing (last 24 hours)"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={mockData.eventBusActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="events" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
              <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
              <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cluster Hierarchy */}
        <ChartCard
          title="Cluster Hierarchy"
          subtitle="Distribution across depth levels"
        >
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={mockData.clusterHierarchy} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748B" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tag Usage */}
        <ChartCard
          title="Tag Usage Distribution"
          subtitle="Most popular tags"
        >
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={mockData.tagUsage.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {mockData.tagUsage.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Content Distribution */}
        <ChartCard
          title="Content Distribution"
          subtitle="Artifact types breakdown"
        >
          <div className="space-y-3">
            {mockData.contentDistribution.map((item, index) => {
              const Icon = item.icon;
              const percentage = (item.value / mockData.contentDistribution.reduce((sum, i) => sum + i.value, 0) * 100);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{item.value.toLocaleString()}</span>
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${percentage}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <ChartCard
          title="System Health"
          subtitle="Infrastructure status monitoring"
        >
          <div className="space-y-4">
            {Object.entries(mockData.systemHealth).map(([service, data]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIndicator status={data.status} />
                  <div>
                    <span className="text-sm font-medium text-slate-200 capitalize">{service.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="text-xs text-slate-400">
                      {service === 'natsCluster' && `Latency: ${data.latency}ms | ${data.throughput}`}
                      {service === 'database' && `Connections: ${data.connections} | Query: ${data.queryTime}ms`}
                      {service === 'cache' && `Hit Rate: ${data.hitRate}% | Memory: ${data.memory}%`}
                      {service === 'api' && `${data.requests} | Errors: ${data.errors}%`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 capitalize">{data.status}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard
          title="Recent Activity"
          subtitle="Latest changes across the taxonomy"
        >
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockData.recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              const colors = {
                create: 'text-green-400',
                update: 'text-blue-400',
                delete: 'text-red-400'
              };
              
              return (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                  <Icon className={`w-4 h-4 ${colors[activity.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">
                      <span className="capitalize">{activity.type}d</span> {activity.entity}: {activity.name}
                    </p>
                    <p className="text-xs text-slate-400">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Top Clusters Table */}
      <div className="mt-8">
        <ChartCard
          title="Top Performing Clusters"
          subtitle="Clusters ranked by activity and growth"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cluster</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Areas</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Activity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Growth</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {mockData.topClusters.map((cluster, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <TreePine className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-200">{cluster.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-300">{cluster.areas}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-sm text-slate-300">{cluster.activity}</span>
                        <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(cluster.activity / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm ${cluster.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {cluster.growth > 0 ? '+' : ''}{cluster.growth}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {cluster.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400 ml-auto" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 ml-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default TaxonomyStatsDashboard;