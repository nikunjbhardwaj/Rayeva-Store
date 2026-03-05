/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#25f46a",
        "background-light": "#f5f8f6",
        "background-dark": "#0a120c",
        "accent-dark": "#162a1c",
        "border-dark": "#22492f",
        "forest-muted": "#1a2e21",
        "forest-accent": "#22492f",
        "forest-glass": "rgba(34, 73, 47, 0.4)",
        "message-bot": "rgba(45, 55, 72, 0.6)"
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
};
