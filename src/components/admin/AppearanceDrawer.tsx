import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AppearanceSettingsTab } from './tabs/AppearanceSettingsTab';
import { X, Palette } from 'lucide-react';

export const AppearanceDrawer: React.FC = () => {
  const { isRtl } = useLanguage();
  const { isCustomizingOpen, setIsCustomizingOpen } = useTheme();

  if (!isCustomizingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCustomizingOpen(false)}
      />

      <div
        className={`fixed inset-y-0 ${
          isRtl ? 'left-0' : 'right-0'
        } max-w-2xl w-full bg-[#F6F4EF] shadow-2xl flex flex-col z-50 border-l rtl:border-l-0 rtl:border-r border-[#D9C29A]/40`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-white border-b border-[#D9C29A]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123B32] text-[#D9C29A] flex items-center justify-center font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#123B32]">
                Quick UI & Theme Customizer
              </h3>
              <p className="text-[11px] text-[#777D75]">
                Adjust live dashboard appearance instantly
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizingOpen(false)}
            className="p-1.5 text-[#777D75] hover:text-[#123B32] rounded-lg hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AppearanceSettingsTab />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-[#D9C29A]/40 flex justify-end">
          <button
            onClick={() => setIsCustomizingOpen(false)}
            className="py-2.5 px-6 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Done Customizing
          </button>
        </div>
      </div>
    </div>
  );
};
