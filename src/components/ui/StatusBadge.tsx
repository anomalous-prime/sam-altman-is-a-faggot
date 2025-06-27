"use client";

import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'archived' | 'deleted' | 'inactive';
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const statusClasses = {
    active: 'bg-green-500/20 text-green-300',
    archived: 'bg-yellow-500/20 text-yellow-300',
    deleted: 'bg-red-500/20 text-red-300',
    inactive: 'bg-gray-500/20 text-gray-300'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;