"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TreePine,
  Database,
  Brain,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main dashboard overview'
  },
  {
    name: 'Taxonomy',
    href: '/taxonomy',
    icon: TreePine,
    description: 'Manage taxonomy structure',
    subItems: [
      { name: 'Overview', href: '/taxonomy' },
      { name: 'Clusters', href: '/taxonomy?tab=clusters' },
      { name: 'Areas', href: '/taxonomy?tab=areas' },
      { name: 'Tags', href: '/taxonomy?tab=tags' },
      { name: 'Graph', href: '/taxonomy?tab=graph' }
    ]
  },
  {
    name: 'Storage',
    href: '/storage',
    icon: Database,
    description: 'File storage management'
  },
  {
    name: 'Semantic',
    href: '/semantic',
    icon: Brain,
    description: 'AI semantic search'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Data analytics and insights'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application settings'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onNavigate }) => {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="flex items-center px-4 py-6 border-b border-slate-700">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TaxoCore</h1>
              <p className="text-xs text-slate-400">Taxonomy Manager</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <TreePine className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={collapsed ? item.description : undefined}
              >
                <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'}`} />
                {!collapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300">
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>

              {/* Sub-navigation for taxonomy */}
              {!collapsed && item.subItems && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={onNavigate}
                      className="block px-3 py-2 text-xs text-slate-400 hover:text-slate-300 rounded-md hover:bg-slate-700 transition-colors"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System Healthy</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;