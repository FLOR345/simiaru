import { lazy } from 'react';

// Cada pantalla vive en su propio archivo y se descarga solo cuando hace falta.
// La portada (Home) no está aquí: es la entrada y se carga de inmediato.
// preload() empieza la descarga antes del clic (al pasar el mouse o enfocar un enlace).
const lazyWithPreload = (load) => {
  const Component = lazy(load);
  Component.preload = load;
  return Component;
};

export const Login = lazyWithPreload(() => import('./components/auth/Login'));
export const Register = lazyWithPreload(() => import('./components/auth/Register'));
export const Dashboard = lazyWithPreload(() => import('./pages/Dashboard'));
export const LessonView = lazyWithPreload(() => import('./pages/LessonView'));
export const Profile = lazyWithPreload(() => import('./pages/Profile'));
export const Dictionary = lazyWithPreload(() => import('./pages/Dictionary'));
export const CultureModule = lazyWithPreload(() => import('./pages/CultureModule'));

// Props para un enlace o botón: precarga la pantalla de destino al acercarse a él
export const preloadOn = (Screen) => ({
  onPointerEnter: () => Screen.preload(),
  onFocus: () => Screen.preload(),
  onTouchStart: () => Screen.preload(),
});
