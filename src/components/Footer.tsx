import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate?: (pageId: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#081a3d] text-white pt-14 pb-10 px-6 border-t border-white/10">
      <div className="max-w-[1250px] mx-auto text-center">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#61c6fb] text-[#081a3d] flex items-center justify-center font-black text-sm">
            EP
          </div>
          <div className="text-[#61c6fb] font-extrabold tracking-[4px] text-xl font-brand-title">
            ECHO PLAN
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[#8da8ca] text-xs font-bold tracking-[4px] uppercase mb-6">
          PLAN • LEARN • GROW • LEAD
        </p>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6e87a9]">
          <div>
            &copy; {new Date().getFullYear()} ECHO PLAN | School Helper. Designed for students everywhere.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#8da8ca] hover:text-[#61c6fb] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};
