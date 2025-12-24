import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Heart, BookOpen, Globe, Trophy, Users, Star, Zap, Crown, Award, Target, Sparkles, TrendingUp, CheckCircle, ArrowRight, Play, Shield, Smartphone, UserX } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.jpg';

const Home = ({ enableGuestMode }) => {
  const [activeTab, setActiveTab] = useState('quechua');
  const navigate = useNavigate();

  // Función para entrar como invitado
  const handleGuestMode = () => {
    if (enableGuestMode) {
      enableGuestMode();
    }
    localStorage.setItem('isGuest', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* ==================== HEADER PREMIUM ==================== */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Premium */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="SIMIARU" 
                  className="h-12 w-auto transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition"></div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                SimiAru
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 font-semibold transition-all hover:scale-105 scroll-smooth">
                Cómo funciona
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-semibold transition-all hover:scale-105 scroll-smooth">
                Características
              </a>
              <a href="#languages" className="text-gray-700 hover:text-purple-600 font-semibold transition-all hover:scale-105 scroll-smooth">
                Idiomas
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 font-semibold transition-all hover:scale-105 scroll-smooth">
                Testimonios
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {/* Botón Modo Invitado */}
              <button 
                onClick={handleGuestMode}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-gray-600 font-semibold hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
              >
                <UserX className="w-4 h-4" />
                Probar sin cuenta
              </button>
              <Link 
                to="/login" 
                className="hidden md:block px-6 py-2.5 text-gray-700 font-bold hover:text-green-600 transition-all"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-3 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Empezar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== HERO ÉPICO ==================== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background con Gradiente Animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Contenido Izquierdo */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge Premium */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Gratis • Sin Publicidad • Sin Límites
                </span>
              </div>
              
              {/* Título Impactante */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Aprende
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Quechua y Aymara
                  </span>
                </h1>
                <p className="text-2xl text-gray-600 font-medium leading-relaxed">
                  La forma más divertida, efectiva y auténtica de dominar las lenguas ancestrales de los Andes 🦙
                </p>
              </div>

              {/* CTAs Principales */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="group px-10 py-5 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 text-center text-lg flex items-center justify-center gap-3"
                >
                  Comenzar Ahora
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {/* Botón Modo Invitado en Hero */}
                <button 
                  onClick={handleGuestMode}
                  className="group px-10 py-5 bg-white border-2 border-orange-400 text-orange-600 font-bold rounded-2xl hover:bg-orange-50 hover:border-orange-500 hover:shadow-xl transition-all duration-300 text-center text-lg flex items-center justify-center gap-3"
                >
                  <UserX className="w-6 h-6" />
                  Probar sin Registro
                </button>
              </div>

              {/* Info sobre modo invitado */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>El modo invitado te permite explorar la Unidad 1 sin crear una cuenta</span>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-4 border-white flex items-center justify-center text-white font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    <span className="text-gray-900 font-bold">1,000+</span> estudiantes activos
                  </p>
                </div>
              </div>

              {/* Stats Rápidos */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-gray-200">
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-1">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Gratis</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    2
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Idiomas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    80+
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Lecciones</div>
                </div>
              </div>
            </div>

            {/* Imagen/Mockup Derecha */}
            <div className="relative animate-fade-in-right">
              {/* Card Principal con Logo */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 transform hover:scale-105 transition-all duration-500">
                <img 
                  src={logo} 
                  alt="SIMIARU App" 
                  className="w-full h-auto mx-auto"
                />
                
                {/* Badge Flotante 1 */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold">+100 Puntos</span>
                  </div>
                </div>

                {/* Badge Flotante 2 */}
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold">Racha 7 días</span>
                  </div>
                </div>

                {/* Badge Modo Invitado */}
                <div className="absolute top-6 -right-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    <span className="font-bold text-sm">Demo Gratis</span>
                  </div>
                </div>
              </div>

              {/* Decoraciones de Fondo */}
              <div className="absolute -z-10 -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ==================== CÓMO FUNCIONA ==================== */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold inline-block">
              🎯 CÓMO FUNCIONA
            </span>
            <h2 className="text-5xl font-black text-gray-900">
              Aprende en <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">3 simples pasos</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tu viaje hacia las lenguas andinas comienza aquí
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-50"></div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">Elige tu idioma</h3>
              <p className="text-gray-600 leading-relaxed">
                Comienza con Quechua o Aymara, ambos con contenido auténtico y hablantes nativos
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">Practica diariamente</h3>
              <p className="text-gray-600 leading-relaxed">
                Solo 10 minutos al día para mantener tu racha, ganar puntos y progresar constantemente
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-black shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">¡Domina el idioma!</h3>
              <p className="text-gray-600 leading-relaxed">
                Alcanza fluidez mientras exploras la cultura andina y conectas con tus raíces
              </p>
            </div>
          </div>

          {/* Features adicionales */}
          <div className="mt-20 grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Progreso visible</h4>
              <p className="text-sm text-gray-600">Ve tu avance en tiempo real</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Aprende rápido</h4>
              <p className="text-sm text-gray-600">Método eficiente y comprobado</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Contenido cultural</h4>
              <p className="text-sm text-gray-600">Aprende más que un idioma</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Modo invitado</h4>
              <p className="text-sm text-gray-600">Prueba sin registrarte</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CARACTERÍSTICAS PREMIUM ==================== */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          {/* Header de Sección */}
          <div className="text-center mb-20 space-y-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold inline-block">
              🎯 POR QUÉ SIMIARU
            </span>
            <h2 className="text-5xl font-black text-gray-900">
              Aprende de forma <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">inteligente</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos tecnología moderna con sabiduría ancestral para crear la mejor experiencia de aprendizaje
            </p>
          </div>

          {/* Grid de Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-blue-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-blue-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Lecciones Interactivas</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ejercicios gamificados con audios de hablantes nativos y retroalimentación instantánea
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>80+ Lecciones disponibles</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-green-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-green-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Cultura Viva</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sumérgete en proverbios, canciones y cuentos tradicionales auténticos
                </p>
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>50+ Contenidos culturales</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-purple-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-purple-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Sistema de Logros</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Gana Ayni Points, mantén rachas y desbloquea insignias culturales únicas
                </p>
                <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>20+ Insignias desbloqueables</span>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-pink-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-pink-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Progreso Inteligente</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Algoritmo adaptativo que se ajusta a tu nivel y velocidad de aprendizaje
                </p>
                <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Personalizado para ti</span>
                </div>
              </div>
            </div>

            {/* Feature 5 - Modo Invitado */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-orange-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-orange-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <UserX className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Modo Invitado</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Prueba la aplicación sin crear una cuenta. Explora la Unidad 1 completamente gratis
                </p>
                <button 
                  onClick={handleGuestMode}
                  className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Probar ahora →</span>
                </button>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-cyan-50 to-cyan-100/50 hover:from-cyan-100 hover:to-cyan-200/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-cyan-200/50">
              <div className="absolute top-6 right-6 w-16 h-16 bg-cyan-500/10 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Sin Publicidad</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Experiencia de aprendizaje pura sin distracciones ni interrupciones molestas
                </p>
                <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Gratis para siempre</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== IDIOMAS CON TABS ==================== */}
      <section id="languages" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold inline-block">
              🌍 IDIOMAS DISPONIBLES
            </span>
            <h2 className="text-5xl font-black text-gray-900">
              Elige tu <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">idioma</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lenguas ancestrales del altiplano andino con contenido auténtico y culturalmente rico
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('quechua')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'quechua'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl shadow-green-500/50 scale-105'
                  : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
            >
              Quechua
            </button>
            <button
              onClick={() => setActiveTab('aymara')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'aymara'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/50 scale-105'
                  : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
            >
              Aymara
            </button>
          </div>

          {/* Content Quechua */}
          {activeTab === 'quechua' && (
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-12 text-white">
                  <div className="flex items-center gap-4 mb-8">
                    <Globe className="w-16 h-16" />
                    <div>
                      <h3 className="text-4xl font-black">Quechua</h3>
                      <p className="text-green-100 text-lg">Cusco - Puno (Collao)</p>
                    </div>
                  </div>
                  <p className="text-xl text-green-50 mb-8 leading-relaxed">
                    El idioma del Imperio Inca, hablado por más de 10 millones de personas en los Andes. Conecta con tus raíces y descubre la lengua de Machu Picchu.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">8 unidades temáticas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">40+ lecciones interactivas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">Audios de hablantes nativos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">Contenido cultural auténtico</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <Link to="/register" className="px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition">
                      Empezar →
                    </Link>
                    <button 
                      onClick={handleGuestMode}
                      className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      Probar
                    </button>
                  </div>
                </div>
                <div className="p-12 bg-gradient-to-br from-green-50 to-white">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">Lo que aprenderás:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Saludos y Presentación</h5>
                        <p className="text-gray-600 text-sm">Rimaykullayki, Allin p'unchay</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Familia y Sociedad</h5>
                        <p className="text-gray-600 text-sm">Tayta, Mama, Wawqi, Ñana</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Números y Tiempo</h5>
                        <p className="text-gray-600 text-sm">Huk, Iskay, Kimsa...</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">4</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Comida y Naturaleza</h5>
                        <p className="text-gray-600 text-sm">Papa, Sara, Kinwa, Pachamama</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Aymara */}
          {activeTab === 'aymara' && (
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-12 text-white">
                  <div className="flex items-center gap-4 mb-8">
                    <Mountain className="w-16 h-16" />
                    <div>
                      <h3 className="text-4xl font-black">Aymara</h3>
                      <p className="text-blue-100 text-lg">Altiplano Puneño</p>
                    </div>
                  </div>
                  <p className="text-xl text-blue-50 mb-8 leading-relaxed">
                    La lengua del lago Titicaca y las montañas sagradas. Más de 2 millones de hablantes mantienen viva esta hermosa lengua del altiplano.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">8 unidades temáticas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">40+ lecciones interactivas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">Audios de hablantes nativos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-lg">Sabiduría del Titicaca</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <Link to="/register" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition">
                      Empezar →
                    </Link>
                    <button 
                      onClick={handleGuestMode}
                      className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      Probar
                    </button>
                  </div>
                </div>
                <div className="p-12 bg-gradient-to-br from-blue-50 to-white">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">Lo que aprenderás:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Saludos y Presentación</h5>
                        <p className="text-gray-600 text-sm">Kamisaraki, Suma urukiwa</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Familia y Comunidad</h5>
                        <p className="text-gray-600 text-sm">Awkisa, Tayka, Jilata, Kullaka</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Números y Calendario</h5>
                        <p className="text-gray-600 text-sm">Maya, Paya, Kimsa...</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">4</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Vida en el Altiplano</h5>
                        <p className="text-gray-600 text-sm">Ch'uqi, Uma, Qarwa, Quta</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold inline-block">
              💬 TESTIMONIOS
            </span>
            <h2 className="text-5xl font-black text-gray-900">
              Lo que dicen nuestros <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">estudiantes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Miles de personas ya están aprendiendo y conectando con sus raíces
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Testimonio 1 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-green-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                "SimiAru me ayudó a reconectar con mis raíces. Ahora puedo hablar con mis abuelos en Quechua. Es emocionante aprender el idioma de mis ancestros."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">María Quispe</h4>
                  <p className="text-sm text-gray-600">Estudiante de Quechua - Cusco</p>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                "La plataforma es increíble. Los audios de hablantes nativos y el contenido cultural hacen que aprender Aymara sea auténtico y divertido."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Juan Mamani</h4>
                  <p className="text-sm text-gray-600">Estudiante de Aymara - Puno</p>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                "Como profesora, uso SimiAru con mis estudiantes. Es la mejor herramienta digital para enseñar lenguas andinas. ¡Felicitaciones!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  C
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Carmen Huamán</h4>
                  <p className="text-sm text-gray-600">Profesora - Arequipa</p>
                </div>
              </div>
            </div>

          </div>

          {/* Stats */}
          <div className="mt-20 grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                1,000+
              </div>
              <p className="text-gray-600 font-semibold">Estudiantes Activos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-gray-600 font-semibold">Calificación Promedio</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                10M+
              </div>
              <p className="text-gray-600 font-semibold">Palabras Aprendidas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                50k+
              </div>
              <p className="text-gray-600 font-semibold">Lecciones Completadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ÉPICO ==================== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Comienza tu aventura andina <span className="text-yellow-300">hoy</span>
            </h2>
            <p className="text-2xl text-white/90 leading-relaxed">
              Únete a miles de estudiantes que ya están conectando con sus raíces y aprendiendo lenguas ancestrales
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link 
                to="/register" 
                className="px-12 py-6 bg-white text-green-600 font-black rounded-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl"
              >
                Empezar Gratis Ahora
              </Link>
              <button 
                onClick={handleGuestMode}
                className="px-12 py-6 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 hover:shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl flex items-center gap-3"
              >
                <UserX className="w-6 h-6" />
                Modo Invitado
              </button>
            </div>
            <div className="text-white/90 text-sm pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Prueba sin registrarte con el modo invitado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER PREMIUM ==================== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Columna 1 - Branding */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="SIMIARU" className="h-12 w-auto" />
                <span className="text-2xl font-black">SimiAru</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Preservando y difundiendo las lenguas ancestrales de los Andes para las futuras generaciones.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition">
                  <span className="text-xl">📷</span>
                </a>
              </div>
            </div>

            {/* Columna 2 - Aprende */}
            <div>
              <h4 className="text-lg font-bold mb-4">Aprende</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Quechua</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Aymara</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cultura Viva</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Diccionario</a></li>
              </ul>
            </div>

            {/* Columna 3 - Recursos */}
            <div>
              <h4 className="text-lg font-bold mb-4">Recursos</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Guías</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Soporte</a></li>
              </ul>
            </div>

            {/* Columna 4 - Empresa */}
            <div>
              <h4 className="text-lg font-bold mb-4">Nosotros</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sobre SimiAru</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Términos</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 SimiAru. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              Hecho con <span className="text-red-500">❤️</span> para preservar lenguas ancestrales
            </p>
          </div>
        </div>
      </footer>

      {/* Agregar estilos de animación */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out 0.3s both;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        /* Ajuste para navegación fija */
        section {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  );
};

export default Home;