const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const hostAppConfig = require('../smart-list-host/tailwind.config.js');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...hostAppConfig,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    ...hostAppConfig.theme,
    extend: {
      ...hostAppConfig.theme.extend,
    },
  },
  plugins: [...hostAppConfig.plugins],
};
