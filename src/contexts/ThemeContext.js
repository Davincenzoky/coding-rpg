import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const darkVars = {
  '--color-bg': '#0a0a1a',
  '--color-bgCard': '#12122a',
  '--color-bgCard2': '#1a1a35',
  '--color-bgDark': '#060612',
  '--color-border': '#2a2a50',
  '--color-borderLight': '#3a3a6a',
  '--color-primary': '#e94560',
  '--color-primaryGlow': 'rgba(233,69,96,0.3)',
  '--color-accent': '#4fc3f7',
  '--color-success': '#4caf50',
  '--color-warning': '#ffd93d',
  '--color-danger': '#ff6b6b',
  '--color-text': '#e8e8f0',
  '--color-textDim': '#8888aa',
  '--color-textMuted': '#555577',
  '--color-gold': '#ffd93d',
  '--color-silver': '#c0c0c0',
  '--color-bronze': '#cd7f32',
};

const lightVars = {
  '--color-bg': '#f0f0f8',
  '--color-bgCard': '#ffffff',
  '--color-bgCard2': '#e8e8f4',
  '--color-bgDark': '#dcdce8',
  '--color-border': '#c8c8dc',
  '--color-borderLight': '#dcdce8',
  '--color-primary': '#d63350',
  '--color-primaryGlow': 'rgba(214,51,80,0.15)',
  '--color-accent': '#0277bd',
  '--color-success': '#388e3c',
  '--color-warning': '#f57f17',
  '--color-danger': '#d32f2f',
  '--color-text': '#1a1a2e',
  '--color-textDim': '#555577',
  '--color-textMuted': '#88889a',
  '--color-gold': '#f57f17',
  '--color-silver': '#757575',
  '--color-bronze': '#8d6e63',
};

function injectThemeCSS() {
  if (typeof document === 'undefined') return;
  const id = 'coding-rpg-theme';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  const toCSS = (vars) =>
    Object.entries(vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n');
  style.textContent = `
:root {
${toCSS(darkVars)}
}
[data-theme="light"] {
${toCSS(lightVars)}
}
*, *::before, *::after {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
`;
  document.head.appendChild(style);
}

injectThemeCSS();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('coding-rpg-theme') !== 'light';
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coding-rpg-theme', theme);
  }, [isDark]);

  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
