import React from 'react';
import { Calendar, BookOpen, BarChart3, Users, ArrowUpRight } from 'lucide-react';

interface FeaturesSectionProps {
  onSelectFeature: (featureKey: 'planner' | 'tips' | 'habits' | 'leadership') => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const features = [
    {
      key: 'planner' as const,
      icon: <Calendar className="w-6 h-6" />,
      title: 'Plan Your Day',
      description: 'Set your goals, manage your tasks and stay organized throughout your school day.',
      badge: 'Interactive Schedule'
    },
    {
      key: 'tips' as const,
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Learn & Grow',
      description: 'Discover useful learning resources, study tips and tools to help you improve.',
      badge: 'Focus & Recall'
    },
    {
      key: 'habits' as const,
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Build Good Habits',
      description: 'Track your progress and develop consistent habits for a brighter future.',
      badge: 'Weekly Streaks'
    },
    {
      key: 'leadership' as const,
      icon: <Users className="w-6 h-6" />,
      title: 'Become a Leader',
      description: 'Build confidence, improve your skills and prepare yourself for greater opportunities.',
      badge: 'Milestone Goals'
    }
  ];

  return (
    <section id="features" className="py-14 sm:py-16 px-4 sm:px-8 lg:px-[7%] bg-white border-b border-[#e4ebf4]">
      <div className="max-w-[1250px] mx-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[#e4ebf4]">
          {features.map((item, idx) => (
            <div
              key={item.key}
              id={`feature-card-${item.key}`}
              onClick={() => onSelectFeature(item.key)}
              className={`group flex flex-col justify-between p-5 lg:px-7 rounded-2xl lg:rounded-none transition-all duration-300 hover:bg-[#f6faff] cursor-pointer ${
                idx !== 0 ? 'lg:pl-8' : ''
              }`}
            >
              <div>
                {/* Feature Icon */}
                <div className="w-[55px] h-[55px] rounded-full bg-[#e7f4ff] text-[#2789dc] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#2789dc] group-hover:text-white transition-all shadow-sm">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-[#13264b] mb-2.5 flex items-center justify-between group-hover:text-[#2789dc] transition-colors">
                  <span>{item.title}</span>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#2789dc]" />
                </h3>

                {/* Description */}
                <p className="text-[#71819a] text-[13.5px] leading-[1.7] mb-4">
                  {item.description}
                </p>
              </div>

              {/* Tag / Micro action */}
              <div className="mt-2 inline-flex items-center text-[11px] font-bold tracking-wide uppercase text-[#3b82f6] bg-[#eff6ff] px-2.5 py-1 rounded-md w-fit">
                {item.badge}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
