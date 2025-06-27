'use client'

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Heart, 
  Star, 
  Download, 
  Share2, 
  Play, 
  Pause, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Minus,
  Check,
  X,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  Battery,
  Home,
  Grid,
  List,
  Filter,
  ArrowRight,
  ArrowLeft,
  Upload,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';

// Types for component showcase
interface ComponentSection {
  id: string;
  title: string;
  description: string;
  components: ComponentItem[];
}

interface ComponentItem {
  name: string;
  description: string;
  component: React.ReactNode;
  code?: string;
}

// Animated Background Component
const AnimatedBackground: React.FC = () => {
  const [circles, setCircles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      'rgba(139, 92, 246, 0.1)',   // purple
      'rgba(99, 102, 241, 0.08)',  // indigo  
      'rgba(6, 182, 212, 0.12)',   // cyan
      'rgba(16, 185, 129, 0.09)',  // emerald
      'rgba(245, 158, 11, 0.1)',   // amber
      'rgba(239, 68, 68, 0.08)',   // red
      'rgba(236, 72, 153, 0.09)',  // pink
    ];

    const newCircles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 400 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20
    }));

    setCircles(newCircles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full blur-xl animate-float"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            background: `radial-gradient(circle, ${circle.color} 0%, transparent 70%)`,
            animationDuration: `${circle.duration}s`,
            animationDelay: `${circle.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          25% { 
            transform: translate(-50%, -50%) translateY(-20px) scale(1.1);
          }
          50% { 
            transform: translate(-50%, -50%) translateY(10px) scale(0.9);
          }
          75% { 
            transform: translate(-50%, -50%) translateY(-15px) scale(1.05);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Glass Card Component
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}> = ({ children, className = '', intensity = 'medium' }) => {
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    strong: 'bg-white/15 backdrop-blur-lg border-white/30'
  };

  return (
    <div className={`rounded-2xl border ${intensityClasses[intensity]} shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

// Sample Components for Showcase
const PrimaryButton: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button className={`${sizeClasses[size]} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
      {children}
    </button>
  );
};

const SecondaryButton: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button className={`${sizeClasses[size]} bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105`}>
      {children}
    </button>
  );
};

const GhostButton: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button className={`${sizeClasses[size]} text-indigo-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200`}>
      {children}
    </button>
  );
};

const GlassInput: React.FC<{ placeholder: string; icon?: React.ReactNode }> = ({ placeholder, icon }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
        {icon}
      </div>
    )}
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200`}
    />
  </div>
);

const GlassSelect: React.FC<{ options: string[]; placeholder: string }> = ({ options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-left text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 flex items-center justify-between"
      >
        <span className={selected ? 'text-white' : 'text-slate-400'}>
          {selected || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const GlassToggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-3">
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
        checked 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
          : 'bg-white/20 backdrop-blur-md'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
        checked ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
    <span className="text-white font-medium">{label}</span>
  </div>
);

const GlassSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-white font-medium">{label}</span>
      <span className="text-indigo-300">{value}%</span>
    </div>
    <div className="relative">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: 'online' | 'offline' | 'busy'; children: React.ReactNode }> = ({ status, children }) => {
  const statusColors = {
    online: 'bg-green-500/20 text-green-300 border-green-500/30',
    offline: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    busy: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'online' ? 'bg-green-400' : 
        status === 'busy' ? 'bg-orange-400' : 'bg-slate-400'
      }`} />
      {children}
    </span>
  );
};

const GlassTab: React.FC<{ tabs: string[]; activeTab: number; onTabChange: (index: number) => void }> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => onTabChange(index)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === index 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const IconButton: React.FC<{ icon: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' }> = ({ icon, variant = 'secondary' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg',
    secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/10'
  };

  return (
    <button className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${variants[variant]}`}>
      {icon}
    </button>
  );
};

// Main Component
const NightForgeDesignSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [toggleStates, setToggleStates] = useState([true, false, true]);
  const [sliderValue, setSliderValue] = useState(75);

  const componentSections: ComponentSection[] = [
    {
      id: 'buttons',
      title: 'Buttons',
      description: 'Interactive elements for user actions with various states and styles',
      components: [
        {
          name: 'Primary Button',
          description: 'Main action buttons with gradient background',
          component: (
            <div className="flex space-x-3">
              <PrimaryButton size="sm">Small</PrimaryButton>
              <PrimaryButton size="md">Medium</PrimaryButton>
              <PrimaryButton size="lg">Large</PrimaryButton>
            </div>
          )
        },
        {
          name: 'Secondary Button',
          description: 'Glass morphism buttons for secondary actions',
          component: (
            <div className="flex space-x-3">
              <SecondaryButton size="sm">Cancel</SecondaryButton>
              <SecondaryButton size="md">Edit</SecondaryButton>
              <SecondaryButton size="lg">Save Draft</SecondaryButton>
            </div>
          )
        },
        {
          name: 'Ghost Button',
          description: 'Minimal buttons for subtle interactions',
          component: (
            <div className="flex space-x-3">
              <GhostButton size="sm">Skip</GhostButton>
              <GhostButton size="md">Learn More</GhostButton>
              <GhostButton size="lg">View Details</GhostButton>
            </div>
          )
        },
        {
          name: 'Icon Buttons',
          description: 'Compact buttons with icons for space-efficient interfaces',
          component: (
            <div className="flex space-x-3">
              <IconButton icon={<Heart className="w-5 h-5" />} variant="primary" />
              <IconButton icon={<Star className="w-5 h-5" />} variant="secondary" />
              <IconButton icon={<Share2 className="w-5 h-5" />} variant="ghost" />
            </div>
          )
        }
      ]
    },
    {
      id: 'inputs',
      title: 'Form Controls',
      description: 'Input elements for data collection with glass morphism aesthetics',
      components: [
        {
          name: 'Text Input',
          description: 'Basic text input with glass effect',
          component: <GlassInput placeholder="Enter your email..." />
        },
        {
          name: 'Input with Icon',
          description: 'Enhanced input with leading icon',
          component: <GlassInput placeholder="Search..." icon={<Search className="w-4 h-4" />} />
        },
        {
          name: 'Select Dropdown',
          description: 'Custom dropdown with glass styling',
          component: <GlassSelect options={['Option 1', 'Option 2', 'Option 3']} placeholder="Choose an option..." />
        },
        {
          name: 'Toggle Switch',
          description: 'Animated toggle switches for boolean values',
          component: (
            <div className="space-y-3">
              <GlassToggle 
                label="Dark Mode" 
                checked={toggleStates[0]} 
                onChange={(checked) => setToggleStates([checked, toggleStates[1], toggleStates[2]])}
              />
              <GlassToggle 
                label="Notifications" 
                checked={toggleStates[1]} 
                onChange={(checked) => setToggleStates([toggleStates[0], checked, toggleStates[2]])}
              />
            </div>
          )
        },
        {
          name: 'Range Slider',
          description: 'Interactive slider for numeric values',
          component: <GlassSlider label="Volume" value={sliderValue} onChange={setSliderValue} />
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Navigation components for seamless user journeys',
      components: [
        {
          name: 'Tab Navigation',
          description: 'Segmented control for switching between views',
          component: (
            <GlassTab 
              tabs={['Overview', 'Analytics', 'Settings']} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )
        },
        {
          name: 'Navigation Pills',
          description: 'Pill-shaped navigation for compact spaces',
          component: (
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium">
                Active
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md text-slate-300 hover:text-white rounded-full text-sm font-medium transition-colors">
                Inactive
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md text-slate-300 hover:text-white rounded-full text-sm font-medium transition-colors">
                Another
              </button>
            </div>
          )
        }
      ]
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Components for status communication and user feedback',
      components: [
        {
          name: 'Status Badges',
          description: 'Visual indicators for different states',
          component: (
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="online">Online</StatusBadge>
              <StatusBadge status="busy">Busy</StatusBadge>
              <StatusBadge status="offline">Offline</StatusBadge>
            </div>
          )
        },
        {
          name: 'Alert Cards',
          description: 'Notification cards with different severity levels',
          component: (
            <div className="space-y-3">
              <GlassCard intensity="light" className="p-4 border-green-500/30">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Success! Your changes have been saved.</span>
                </div>
              </GlassCard>
              <GlassCard intensity="light" className="p-4 border-orange-500/30">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-300 font-medium">Warning: This action cannot be undone.</span>
                </div>
              </GlassCard>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <GlassCard intensity="strong" className="p-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
                NightForge Design System
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                A glassmorphism-inspired component library for building beautiful, modern interfaces
              </p>
              <div className="flex justify-center space-x-4">
                <PrimaryButton size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Kit
                </PrimaryButton>
                <SecondaryButton size="lg">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Docs
                </SecondaryButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Component Showcase */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {componentSections.map((section) => (
              <div key={section.id} className="space-y-6">
                <GlassCard intensity="medium" className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{section.title}</h2>
                  <p className="text-slate-300 mb-6">{section.description}</p>
                  
                  <div className="space-y-8">
                    {section.components.map((component, index) => (
                      <div key={index}>
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-white mb-1">{component.name}</h3>
                          <p className="text-sm text-slate-400">{component.description}</p>
                        </div>
                        
                        <GlassCard intensity="light" className="p-6">
                          {component.component}
                        </GlassCard>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="max-w-7xl mx-auto mt-12">
          <GlassCard intensity="strong" className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { name: 'Indigo', color: '#6366F1' },
                { name: 'Purple', color: '#8B5CF6' },
                { name: 'Cyan', color: '#06B6D4' },
                { name: 'Emerald', color: '#10B981' },
                { name: 'Amber', color: '#F59E0B' },
                { name: 'Red', color: '#EF4444' },
                { name: 'Pink', color: '#EC4899' }
              ].map((colorInfo) => (
                <GlassCard key={colorInfo.name} intensity="light" className="p-4 text-center">
                  <div 
                    className="w-16 h-16 rounded-xl mx-auto mb-3 shadow-lg"
                    style={{ backgroundColor: colorInfo.color }}
                  />
                  <h4 className="text-white font-medium">{colorInfo.name}</h4>
                  <p className="text-slate-400 text-xs font-mono">{colorInfo.color}</p>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12">
          <GlassCard intensity="medium" className="p-6">
            <div className="text-center">
              <p className="text-slate-300">
                Built with ❤️ using React, TypeScript, and Tailwind CSS
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <GhostButton>Documentation</GhostButton>
                <GhostButton>GitHub</GhostButton>
                <GhostButton>Figma Kit</GhostButton>
                <GhostButton>Support</GhostButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default NightForgeDesignSystem;