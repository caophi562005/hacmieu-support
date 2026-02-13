"use client";

import { widgetSettingsAtom } from "@/modules/widget/atoms/widget-atom";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

const DEFAULT_THEME = "bubblegum";

function ThemeScript() {
  const scriptContent = `
(function () {
  try {
    var theme = '${DEFAULT_THEME}';

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
  const widgetSettings = useAtomValue(widgetSettingsAtom);

  const theme = widgetSettings?.theme || DEFAULT_THEME;

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

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <>
      <ThemeScript />
      {children}
    </>
  );
}
