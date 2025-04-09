import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
          colors: {
            // Custom theme colors
            'dark-brown': '#4E3629',
            'mocha': '#9E7A47',
            'beige': '#D8C8A4',
            'light-gold': '#D9C97E',
            'soft-green': '#A7C5A4',
            'amber-gold': '#FFBF49',
            'charcoal': '#333333',
          }
        },
    },

  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        yensao: {
          "primary": "#9E7A47",          // Mocha Mousse
          "secondary": "#A7C5A4",        // Soft Green
          "accent": "#FFBF49",           // Amber Gold
          "neutral": "#4E3629",          // Dark Brown
          "base-100": "#FFFFFF",         // White
          "base-200": "#D8C8A4",         // Beige
          "base-300": "#D9C97E",         // Light Gold
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",
    ],
  },
};

