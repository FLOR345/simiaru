export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Contenedor centrado con márgenes que crecen con la pantalla y un ancho máximo cómodo:
    // en monitores anchos el contenido ya no queda pegado a los bordes
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '3rem', xl: '4rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1360px' },
    },
    extend: {
      colors: {
        wiphala: {
          red: '#E63946',
          orange: '#F77F00',
          yellow: '#FCBF49',
          green: '#06A77D',
          blue: '#118AB2',
          purple: '#6A4C93',
          white: '#F8F9FA'
        }
      }
    }
  },
  future: {
    // hover: solo en dispositivos con mouse; en pantallas táctiles no queda "pegado" tras tocar
    hoverOnlyWhenSupported: true
  },
  plugins: []
};