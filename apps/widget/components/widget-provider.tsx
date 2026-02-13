"use client";

import { api } from "@workspace/backend/_generated/api";
import { useAction } from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "widget-theme";
const DEFAULT_THEME = "bubblegum";

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
  const getWidgetSettings = useAction(
    api.public.widgetSettings.getByOrganizationId,
  );

  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as string) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    getWidgetSettings({ organizationId: "org_39YyzfYRXyMSK7fCI7QT4Le8vNB" })
      .then((result) => {
        if (result.valid && result.widgetSettings?.theme) {
          const currentTheme = localStorage.getItem(STORAGE_KEY);

          if (currentTheme !== result.widgetSettings.theme) {
            setThemeState(result.widgetSettings.theme);
            localStorage.setItem(STORAGE_KEY, result.widgetSettings.theme);
            applyTheme(result.widgetSettings.theme);
          }
        } else {
          console.log(result.reason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const applyTheme = useCallback((newTheme: string) => {
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
    async (newTheme: string) => {
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
