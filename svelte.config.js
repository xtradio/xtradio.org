const postcss = require('postcss')({
    plugins: [
        require('tailwindcss'),
        require('postcss-nested')('./tailwindcss-config.js'),
    ],
});

module.exports = {
    compiler: {
        css: false,
    },
    preprocess: {
        style: async ({ content, filename }) => {
            return {
                code: await postcss.process(content).css
            };
        }
    },
};