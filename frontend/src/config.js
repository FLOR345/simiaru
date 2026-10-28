// Dirección del backend, en un solo lugar.
// - En tu computadora (npm run dev) usa el backend local.
// - En la web publicada usa el backend de Render.
// Se puede cambiar con la variable VITE_BACKEND_URL si algún día se muda el backend.
export const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? 'https://simiaru.onrender.com' : 'http://localhost:5000');
