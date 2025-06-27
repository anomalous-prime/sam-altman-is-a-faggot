"use client";

import React, { useMemo } from 'react';
import { TreePine, Grid, Tags } from 'lucide-react';
import { Tag } from '@/types/api';

interface OverviewViewProps {
  clustersCount: number;
  areasCount: number;
  tagsCount: number;
  tags: Tag[];
}

const OverviewView: React.FC<OverviewViewProps> = ({
  clustersCount,
  areasCount,
  tagsCount,
  tags
}) => {
  // Calculate top tags by usage (simulated usage count based on area_count)
  const topTags = useMemo(() => {
    return tags
      .filter(tag => tag.area_count !== undefined && tag.area_count > 0)
      .map(tag => ({
        slug: tag.slug,
        name: tag.display_name,
        color: tag.color,
        usageCount: tag.area_count || 0
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 8); // Top 8 tags
  }, [tags]);

  const stats = [
    {
      name: 'Total Clusters',
      value: clustersCount,
      icon: TreePine,
      color: 'text-indigo-400',
      description: 'Hierarchical cluster structure'
    },
    {
      name: 'Total Areas',
      value: areasCount,
      icon: Grid,
      color: 'text-green-400',
      description: 'Content organization areas'
    },
    {
      name: 'Total Tags',
      value: tagsCount,
      icon: Tags,
      color: 'text-purple-400',
      description: 'Classification tags'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Taxonomy Overview</h2>
        <p className="text-slate-400">
          Monitor and manage your content classification system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 text-center hover:border-slate-600 transition-colors"
            >
              <Icon className={`w-12 h-12 ${stat.color} mx-auto mb-3`} />
              <h4 className="text-3xl font-bold text-slate-200 mb-1">{stat.value}</h4>
              <p className="text-slate-400 font-medium mb-2">{stat.name}</p>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Most Used Tags</h3>
          {topTags.length > 0 ? (
            <div className="space-y-3">
              {topTags.map((tag, index) => (
                <div key={tag.slug} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400 w-4">#{index + 1}</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm text-slate-200">{tag.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{tag.usageCount} uses</span>
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: tag.color,
                          width: `${topTags[0] ? (tag.usageCount / topTags[0].usageCount) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Tags className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No tags with usage data found</p>
              <p className="text-slate-500 text-xs mt-1">Create and assign tags to areas to see usage statistics</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-200 mb-2">Recent Activity</h4>
              <p className="text-sm text-slate-400">
                View latest changes to your taxonomy structure
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-200 mb-2">Health Check</h4>
              <p className="text-sm text-slate-400">
                Validate taxonomy integrity and relationships
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
              <h4 className="font-medium text-slate-200 mb-2">Export Data</h4>
              <p className="text-sm text-slate-400">
                Download taxonomy structure in various formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;