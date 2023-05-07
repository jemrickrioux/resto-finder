import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-secondary",
    "bg-light",
    "bg-dark",
    "bg-dark-100",
    "bg-gray-600",
    "border-green-100",
    "border-red-500",
    "hover:bg-primary",
    "hover:bg-black",
    "border-red-500",
  ],
  theme: {
    extend: {
      fontFamily: {
        brandon: ["Brandon"],
        brandonlight: ["BrandonLight"],
        anek: "Anek",
        mono: "Source Code Pro",
      },
      colors: {
        main: "#03120E",
        light: "#F4F0BB",
        secondary: "#EF6F6C",
        primary: "#43BCCD",
        accent: "#133C55",
      },
    },
  },
  plugins: [
    require("tailwind-heropatterns")({
      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      // patterns: ['polka-dots', 'signal',"i-like-food" ,"four-point-stars"],
      patterns: [],

      // The foreground colors of the pattern
      colors: {
        default: "#76efd3", // also works with rgb(0,0,205)
        light: "#F4F0BB",
      },

      // The foreground opacity
      opacity: {
        default: "0.1",
        100: "1.0",
      },
    }),
  ],
} satisfies Config;
