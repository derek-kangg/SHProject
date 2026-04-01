import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forme: {
          bg:        "#F9F7F4",
          card:      "#FFFFFF",
          secondary: "#F0EDE8",
          ink:       "#111110",
          muted:     "#726D68",
          subtle:    "#A8A39E",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "12px", pill: "999px" },
    },
  },
  plugins: [],
};
export default config;
