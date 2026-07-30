"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  animations: boolean;
  glassmorphism: boolean;

  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setAnimations: (value: boolean) => void;
  setGlassmorphism: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(
  null
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>("dark");

  const [accentColor, setAccentColor] =
    useState("#8B5CF6");

  const [animations, setAnimations] =
    useState(true);

  const [glassmorphism, setGlassmorphism] =
    useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    document.documentElement.style.setProperty(
      "--accent-color",
      accentColor
    );

    document.documentElement.dataset.animations =
      animations ? "on" : "off";

    document.documentElement.dataset.glass =
      glassmorphism ? "on" : "off";
  }, [
    theme,
    accentColor,
    animations,
    glassmorphism,
  ]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        animations,
        glassmorphism,
        setTheme,
        setAccentColor,
        setAnimations,
        setGlassmorphism,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}