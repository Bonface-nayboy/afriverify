'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function ColorThemeInitializer() {
  const { theme } = useTheme();

  useEffect(() => {
    // Prevent hydration mismatch by only running on client
    const applyTheme = () => {
      const savedColor = localStorage.getItem('app-color-theme') || 'default';
      
      // Themes should NEVER be applied on the system default mode
      // If theme is 'system', we explicitly remove the data-color-theme attribute
      if (theme === 'system') {
        document.documentElement.removeAttribute('data-color-theme');
      } else {
        if (savedColor !== 'default') {
          document.documentElement.setAttribute('data-color-theme', savedColor);
        } else {
          document.documentElement.removeAttribute('data-color-theme');
        }
      }
    };

    applyTheme();
  }, [theme]);

  return null;
}
