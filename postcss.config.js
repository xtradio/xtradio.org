const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/index.html',
    './src/**/*.svelte'
  ],
  whitelistPatterns: [/svelte-/, /icon-/],
  // defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  defaultExtractor: content => (content.match(/[A-Za-z0-9-_:/]+/g) || []).map(m => m.replace('class:', ''))
});


module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('postcss-nested')(),
    require('postcss-each'),
    require('postcss-assets')({ basePath: 'src/assets/' }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};