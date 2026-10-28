// Niveles del usuario (columna usuarios.nivel_actual), con nombres de la organización andina.
// Un solo lugar para que el panel y el perfil muestren lo mismo.
const LEVELS = {
  1: { name: 'Ayllu', subtitle: 'Comunidad' },
  2: { name: "Mark'a", subtitle: 'Pueblo' },
  3: { name: 'Llaqta', subtitle: 'Ciudad' },
  4: { name: 'Suyu', subtitle: 'Región' },
  5: { name: 'Tawantinsuyu', subtitle: 'Las cuatro regiones' },
};

export const getLevelNumber = (user) => Number(user?.nivel_actual ?? user?.nivel ?? 1) || 1;

export const getLevel = (user) => {
  const number = getLevelNumber(user);
  return { number, ...(LEVELS[number] || { name: `Nivel ${number}`, subtitle: 'Aprendiz' }) };
};
