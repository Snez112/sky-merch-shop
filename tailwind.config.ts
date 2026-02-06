import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary": "#f85654",
        "secondary": "#a2dcf4",
        "accent": "#f85654",
        "background-light": "#fdfdfd",
        "background-dark": "#0a1628",
        "card-light": "#ffffff",
        "card-dark": "#152238",
        "text-dark": "#e8f4f8",
      },
      fontFamily: {
          "display": ["var(--font-be-vietnam-pro)", "sans-serif"]
      },
      borderRadius: {
          "DEFAULT": "0.5rem",
          "lg": "1rem",
          "xl": "1.5rem",
          "full": "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
