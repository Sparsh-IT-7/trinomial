import React from 'react';
import { KartavyaLogo } from './KartavyaLogo';
import { ActiveTab } from './Header';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#047857]/20 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#047857]/15">
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <KartavyaLogo size={32} />
              <span className="font-extrabold text-lg tracking-tight text-[#047857]">KARTAVYA</span>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
                CIVIC SYSTEM
              </span>
            </div>
            <p className="text-xs text-[#047857]/80 max-w-md leading-relaxed">
              Turn civic responsibility into real-world action. Discover community problems and connect citizens with authorities, NGOs, and volunteering opportunities.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium border border-[#047857] text-[#047857] rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
              <span>Demonstration & Verified Civic Data</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#047857]">
              CIVIC PLATFORM
            </h4>
            <ul className="space-y-2 text-xs text-[#047857]/80">
              <li>
                <button
                  onClick={() => onNavigate('feed')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  Civic Discovery Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  Civic Action Events & Volunteering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rag')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  RAG Evidence Q&A
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ingestion')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  OpenCity Scraper Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collabs')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  Community Action & Collabs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stakeholders')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  Stakeholder Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#047857]">
              GOVERNANCE
            </h4>
            <ul className="space-y-2 text-xs text-[#047857]/80">
              <li>
                <a href="#about" className="hover:text-[#047857] hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#047857] hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#047857] hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#047857] hover:underline cursor-pointer"
                >
                  Citizen Ledger Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#047857]/70 gap-2">
          <div>© 2025 Kartavya Civic Action Foundation. Public Domain Architecture.</div>
          <div className="font-medium text-[#047857]">See the issue. Be the change.</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
