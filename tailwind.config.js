let zIndex = {};
for (let i = 0; i <= 101; i++) {
  zIndex[i] = i;
}

module.exports = {
  theme: {
    
    extend: {
      colors: {
        splash: '#141517',
        controls: '#191a1d',
        rail: '#232629',
        progress: '#51565b',
        dot: '#6d747a',
      },
      zIndex,
    },
  },
  variants: {
    display: ['responsive', 'hover', 'group-hover'],
  },
  plugins: [],
};
