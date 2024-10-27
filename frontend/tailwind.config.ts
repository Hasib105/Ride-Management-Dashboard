import type { Config } from 'tailwindcss';
import flowbite from 'flowbite/plugin';

/** @type {Config} */
const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your TypeScript files
    "./node_modules/flowbite/**/*.js" // Include Flowbite's JavaScript files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite // Add Flowbite as a plugin
  ],
};

export default config;
