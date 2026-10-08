/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        enamel: "#F6F7F9", // page background, like a white enamel bowl
        cobalt: { DEFAULT: "#1D3FA6", deep: "#142E7F", soft: "#E6EBF8" }, // the bowl rim
        ata: { DEFAULT: "#D7261E", deep: "#A81A14", soft: "#FBE7E5" }, // scotch bonnet red
        palm: { DEFAULT: "#F3A712", soft: "#FDF1D6" }, // palm oil gold
        ugu: { DEFAULT: "#1F7A47", soft: "#E3F2E9" }, // ugu leaf green
        ink: { DEFAULT: "#141826", soft: "#4A5068", faint: "#8A90A6" },
        line: "#DDE1EA",
      },
      fontFamily: {
        display: ['"Anybody Variable"', "system-ui", "sans-serif"],
        sans: ['"Figtree Variable"', "system-ui", "sans-serif"],
      },
      borderRadius: { bowl: "999px" },
      boxShadow: {
        rim: "0 0 0 6px #1D3FA6, 0 0 0 12px #F6F7F9, 0 0 0 14px #DDE1EA",
      },
    },
  },
  plugins: [],
};
