import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0e1a",
          800: "#0f1629",
        },
      },
    },
  },
  plugins: [],
};

export default config;
