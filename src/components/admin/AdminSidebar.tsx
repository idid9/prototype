import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  CalendarCheck,
  Users,
  Megaphone,
  Sparkles,
  BarChart3,
  Globe2,
  Settings,
  Palette,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'experiences'
  | 'destinations'
  | 'inquiries'
  | 'customers'
  | 'promotions'
  | 'interactive'
  | 'analytics'
  | 'website'
  | 'appearance'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onGoToVisitorSite: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  newInquiriesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onGoToVisitorSite,
  onLogout,
  collapsed,
  onToggleCollapse,
  newInquiriesCount = 0,
}) => {
  const { language, isRtl } = useLanguage();
  const { settings, isDarkGlass, blurPixels, currentAccentHex } = useTheme();
  const isArabic = language === 'ar';

  const menuItems: { id: AdminTab; label: string; labelAr: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', labelAr: 'نظرة عامة', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'experiences', label: 'Experiences', labelAr: 'إدارة التجارب', icon: <Compass className="w-4 h-4" /> },
    { id: 'destinations', label: 'Destinations', labelAr: 'الوجهات', icon: <MapPin className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Bookings & Inquiries', labelAr: 'الحجوزات والطلبات', icon: <CalendarCheck className="w-4 h-4" />, badge: newInquiriesCount },
    { id: 'customers', label: 'Customers CRM', labelAr: 'إدارة العملاء', icon: <Users className="w-4 h-4" /> },
    { id: 'promotions', label: 'Marketing & Promos', labelAr: 'التسويق والعروض', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'interactive', label: 'Interactive Content', labelAr: 'المحتوى التفاعلي', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', labelAr: 'التحليلات', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'website', label: 'Website CMS', labelAr: 'محتوى الموقع', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'appearance', label: 'Glassy & Theme Studio', labelAr: 'المظهر والزجاجي', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
  ];

  const sidebarStyle: React.CSSProperties = settings.isGlassyEnabled
    ? {
        backgroundColor: isDarkGlass
          ? `rgba(12, 18, 16, ${Math.min(0.86, settings.cardTranslucency + 0.25)})`
          : 'rgba(18, 59, 50, 0.88)',
        backdropFilter: `blur(${blurPixels}px) saturate(150%)`,
        WebkitBackdropFilter: `blur(${blurPixels}px) saturate(150%)`,
        borderInlineEnd: `1px solid rgba(255, 255, 255, ${Math.max(0.14, settings.borderOpacity * 0.7)})`,
      }
    : {
        backgroundColor: '#123B32',
        borderInlineEnd: '1px solid #1D5546',
      };

  return (
    <aside
      style={sidebarStyle}
      className={`fixed top-0 bottom-0 z-30 flex flex-col text-white transition-all duration-300 ${
        isRtl ? 'right-0' : 'left-0'
      } ${collapsed ? 'w-20' : 'w-64'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/15">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#102E29]"
              style={{ backgroundColor: currentAccentHex }}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none whitespace-nowrap">
                Tour<span style={{ color: currentAccentHex }}>Flow</span>
              </span>
              <span className="text-[10px] text-white/60 tracking-wider uppercase mt-1">
                Operator SaaS
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#D9C29A] text-[#123B32] flex items-center justify-center font-bold mx-auto">
            <Compass className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1D5546] text-[#D9C29A] shadow-sm'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
              title={item.label}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#D9C29A]' : 'text-white/70'}>
                  {item.icon}
                </span>
                {!collapsed && <span>{isArabic ? item.labelAr : item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#C6A46B] text-[#123B32]">
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C6A46B] absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-[#1D5546]/80 space-y-1">
        {/* Switch to Visitor Portal */}
        <button
          onClick={onGoToVisitorSite}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Open Visitor Website"
        >
          <ExternalLink className="w-4 h-4 text-[#D9C29A] shrink-0" />
          {!collapsed && <span>Visitor Website</span>}
        </button>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
