// Mantine solo en las pantallas que lo usan (panel y perfil): así no pesa en la portada.
// Estilos sin @layer y solo de los componentes usados: las clases de Mantine le ganan
// al reset de Tailwind (preflight) y no se cargan los ~200 KB de toda la librería.
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles/SegmentedControl.css';
import '@mantine/core/styles/RingProgress.css';
import '@mantine/core/styles/Tooltip.css';

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'inherit',
  defaultRadius: 'md',
  // Respeta "reducir movimiento" del sistema en todas las transiciones de Mantine
  respectReducedMotion: true,
});

const MantineShell = ({ children }) => (
  <MantineProvider theme={theme} forceColorScheme="light">
    {children}
  </MantineProvider>
);

export default MantineShell;
