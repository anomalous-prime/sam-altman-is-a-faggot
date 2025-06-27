"use client";

import { useState, useEffect } from "react";
import { TreePine, BarChart3, Settings, Database, Brain } from "lucide-react";

interface ServiceStatus {
  taxonomy: boolean;
  storage: boolean;
  semantic: boolean;
  nlq: boolean;
  pecgw: boolean;
}

interface ServiceStats {
  totalClusters: number;
  totalAreas: number;
  totalTags: number;
  totalFiles: number;
  totalEmbeddings: number;
  totalQueries: number;
  activeCapabilities: number;
  systemHealth: 'excellent' | 'good' | 'degraded' | 'critical' | 'unknown';
}

// Mock data for services
const mockStats: ServiceStats = {
  totalClusters: 6,
  totalAreas: 24,
  totalTags: 15,
  totalFiles: 5,
  totalEmbeddings: 4,
  totalQueries: 127,
  activeCapabilities: 3,
  systemHealth: 'good',
};

const mockServiceStatus: ServiceStatus = {
  taxonomy: true,
  storage: true,
  semantic: true,
  nlq: false,
  pecgw: false,
};

export default function HomePage() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(mockServiceStatus);
  const [stats, setStats] = useState<ServiceStats>(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeMockServices = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServiceStatus(mockServiceStatus);
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMockServices();
  }, []);

  const services = [
    { 
      id: 'taxonomy', 
      label: 'Taxonomy', 
      icon: TreePine, 
      description: 'Hierarchical data management',
      status: serviceStatus.taxonomy,
      color: 'from-indigo-500 to-purple-600',
      href: '/taxonomy'
    },
    { 
      id: 'storage', 
      label: 'Storage', 
      icon: Database, 
      description: 'File & metadata management',
      status: serviceStatus.storage,
      color: 'from-cyan-500 to-blue-600',
      href: '/storage'
    },
    { 
      id: 'semantic', 
      label: 'Semantic', 
      icon: Brain, 
      description: 'AI-powered analysis',
      status: serviceStatus.semantic,
      color: 'from-pink-500 to-red-600',
      href: '/semantic'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Data insights and reports',
      status: true,
      color: 'from-green-500 to-emerald-600',
      href: '/analytics'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'Application configuration',
      status: true,
      color: 'from-orange-500 to-yellow-600',
      href: '/settings'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Initializing System</h2>
            <p className="text-slate-400 animate-pulse">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to TaxoCore
            </h1>
            <p className="text-slate-400 text-lg">
              Your command center for intelligent data management
            </p>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <a 
                  key={service.id}
                  href={service.href}
                  className="block group relative overflow-hidden rounded-xl transition-all duration-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 p-6"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color} mb-4 w-fit`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.label}</h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                      service.status 
                        ? 'text-green-300 bg-green-500/20 border border-green-500/30' 
                        : 'text-red-300 bg-red-500/20 border border-red-500/30'
                    }`}>
                      {service.status ? 'Online' : 'Offline'}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-indigo-400 text-sm font-medium">Explore →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* System Health Dashboard */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400">{Object.values(serviceStatus).filter(Boolean).length}/5</div>
                <div className="text-sm text-slate-400">Services Online</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{stats.totalClusters + stats.totalAreas}</div>
                <div className="text-sm text-slate-400">Total Entities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.totalFiles}</div>
                <div className="text-sm text-slate-400">Files Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">{stats.totalEmbeddings}</div>
                <div className="text-sm text-slate-400">AI Embeddings</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}