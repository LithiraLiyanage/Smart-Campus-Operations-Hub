/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#0f172a',
          navy: '#1e1b4b',
          purple: '#4c1d95',
          electric: '#3b82f6',
          lavender: '#ddd6fe',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
  // To avoid conflicts with Ant Design, you can prefix or just be careful. We are wrapping things properly.
  // corePlugins: {
  //   preflight: false, // Don't disable preflight, it might break our lovely Tailwind forms. 
  //   // If Antd breaks, we'll import antd reset css manually.
  // },
};
