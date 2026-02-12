"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "bubblegum" | "vintage-paper" | "doom-64";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "widget-theme";
const DEFAULT_THEME: Theme = "bubblegum";

function ThemeScript() {
  const scriptContent = `
(function () {
  try {
    var theme = localStorage.getItem('${STORAGE_KEY}') || '${DEFAULT_THEME}';
    
    // Apply classes
    document.body.classList.add(theme);
    document.body.classList.add('font-sans');
    document.body.classList.add('antialiased');
    
    // Inject font CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/fonts/' + theme + '.font.css';
    document.head.appendChild(link);
  } catch (e) {
    console.error('Theme init error:', e);
  }
})();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      // Không set type, để browser chạy như script bình thường
    />
  );
}

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    {
      organizationId: "org_39YyzfYRXyMSK7fCI7QT4Le8vNB",
    },
  );

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as Theme) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    if (!widgetSettings?.theme) return;

    const convexTheme = widgetSettings.theme as Theme;
    const currentTheme = localStorage.getItem(STORAGE_KEY);

    if (convexTheme !== currentTheme) {
      setThemeState(convexTheme);
      localStorage.setItem(STORAGE_KEY, convexTheme);
      applyTheme(convexTheme);
    }
  }, [widgetSettings?.theme]);

  const applyTheme = useCallback((newTheme: Theme) => {
    document.body.className = `${newTheme} font-sans antialiased`;

    const oldLink = document.querySelector('link[href^="/fonts/"]');
    if (oldLink) {
      oldLink.remove();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/fonts/${newTheme}.font.css`;
    document.head.appendChild(link);
  }, []);

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    },
    [applyTheme],
  );

  return (
    <>
      <ThemeScript />
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useCustomTheme must be used within CustomThemeProvider");
  }

  return context;
}
