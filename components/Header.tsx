
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Page, AppSettings } from '../types';
import { NAV_ITEMS, DEFAULT_APP_SETTINGS } from '../constants';
import Button from './Button';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onLogout: () => void;
  appSettings: AppSettings;
}

const Header: React.FC<HeaderProps> = ({ onLogout, appSettings }) => {
  const location = useLocation();
  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-500'; // sky-500 is a good shade for avatar
  const headingTextColor = appSettings.headingTextColor || DEFAULT_APP_SETTINGS.headingTextColor || 'text-slate-700';
  
  let pageTitle: Page = Page.Dashboard; // Default title

  const currentNavItem = NAV_ITEMS.find(item => {
    // Exact match or handle root path specially
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  if (currentNavItem) {
    pageTitle = currentNavItem.name;
  } else if (location.pathname === '/login') {
    pageTitle = 'Login' as Page; 
  }
  
  const avatarBgClass = primaryColor.startsWith("#") ? '' : `bg-${primaryColor}`;
  const avatarStyle = primaryColor.startsWith("#") ? { backgroundColor: primaryColor } : {};

  const headingStyle = headingTextColor.startsWith('#') ? { color: headingTextColor } : {};
  const headingClass = headingTextColor.startsWith('#') ? '' : headingTextColor;


  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-30 print:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className={`text-2xl font-semibold ${headingClass}`} style={headingStyle}>{pageTitle}</h2>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:block">Welcome, Admin!</span>
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm ${avatarBgClass}`}
              style={avatarStyle}
            >
                A
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              leftIcon={<ArrowLeftOnRectangleIcon className="h-5 w-5"/>}
              aria-label="Logout"
            >
              Logout
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
