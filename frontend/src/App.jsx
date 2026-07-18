import React, { useState, useEffect } from 'react';

export default function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [view, setView] = useState('simulador'); // Vistas: 'personas', 'refugios', 'simulador'
  const [showFicha, setShowFicha] = useState(false); // Control del desplegable de la Ficha Técnica
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Efecto para persistir y aplicar el tema
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Estados del simulador matematico (decimales permitidos)
  const [lam, setLam] = useState(19.7); 
  const [mu, setMu] = useState(9.4);   
  const [c, setC] = useState(4);     
  const [c1, setC1] = useState(15.0);   
  const [c2, setC2] = useState(120.0);  

  const [autoCalcularC, setAutoCalcularC] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errorColapso, setErrorColapso] = useState("");

  // Lógica para auto-ajustar 'c' si la opción está activa
  useEffect(() => {
    if (autoCalcularC) {
      const cMinimo = Math.floor(lam / mu) + 1;
      setC(cMinimo);
    }
  }, [lam, mu, autoCalcularC]);

  // Consumo de la API del motor de colas
  useEffect(() => {
    if (c <= lam / mu) {
      setErrorColapso(`⚠️ ALERTA LOGÍSTICA: Servidores insuficientes (c ≤ λ/μ). El portón de ingreso a "Ciudad Carpita" colapsará administrativamente. Se requiere un mínimo de ${Math.floor(lam / mu) + 1} taquillas.`);
      setResultado(null);
      return;
    }
    
    setErrorColapso("");

    fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        lam: parseFloat(lam), 
        mu: parseFloat(mu), 
        c: parseInt(c), 
        c1: parseFloat(c1), 
        c2: parseFloat(c2) 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.configuracion_actual) {
        setResultado(data);
      } else {
        console.error("Respuesta de API inválida o error en el servidor:", data);
        setResultado(null);
      }
    })
    .catch(err => {
      console.error(err);
      setResultado(null);
    });
  }, [lam, mu, c, c1, c2]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 font-sans flex flex-col justify-between relative transition-all duration-300 ease-in-out">
      
      {/* ========================================================
          HEADER INSTITUCIONAL PATRIA (CON MENÚ DE NAVEGACIÓN ACTIVO)
          ======================================================== */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('simulador')}>
            <span className="text-xl font-black tracking-tighter text-blue-800 dark:text-blue-400 flex items-center">
              <span className="text-yellow-500 mr-1">🇻🇪</span> PATRIA<span className="text-xs font-semibold text-gray-500 dark:text-slate-400 ml-2 tracking-normal border-l dark:border-slate-700 pl-2">Institución</span>
            </span>
          </div>
          
          <nav className="flex space-x-2 md:space-x-4 text-xs font-bold uppercase items-center">
            <button 
              onClick={() => setView('personas')} 
              className={`pb-1 transition-colors ${view === 'personas' ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400' : 'text-gray-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
            >
              Persona
            </button>
            <button 
              onClick={() => setView('refugios')} 
              className={`pb-1 transition-colors ${view === 'refugios' ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400' : 'text-gray-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
            >
              Refugios
            </button>
            <button 
              onClick={() => setView('simulador')} 
              className={`pb-1 transition-colors ${view === 'simulador' ? 'text-red-650 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400' : 'text-gray-600 dark:text-slate-300 hover:text-red-650 dark:hover:text-red-400'}`}
            >
              Plan de Contingencia
            </button>

            {/* BOTÓN DE LIBRO INTERROGACIÓN (FICHA TÉCNICA) */}
            <button 
              onClick={() => setShowFicha(!showFicha)}
              className="bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-600 p-2 rounded-full transition-all ml-2 flex items-center justify-center border border-blue-200 dark:border-slate-600"
              title="Ver Ficha Técnica del Modelo"
            >
              📖 <span className="hidden md:inline ml-1 text-[10px] uppercase font-black tracking-wider">Ficha Técnica</span>
            </button>

            {/* BOTÓN DE TOGGLE DE MODO OSCURO / MODO CLARO */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-yellow-400 transition-all duration-300 flex items-center justify-center"
              title={theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================
          DESPLEGABLE FLOTANTE DE LA FICHA TÉCNICA DEL MODELO
          ======================================================== */}
      {showFicha && (
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-lg animate-fade-in p-6 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex justify-between items-center border-b dark:border-slate-700 pb-2 mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-slate-200 flex items-center">
                📊 Ficha Técnica: Formulación Científica del Modelo Estocástico
              </h3>
              <button onClick={() => setShowFicha(false)} className="text-gray-400 dark:text-slate-300 hover:text-gray-605 font-bold text-sm bg-gray-100 dark:bg-slate-750 px-2 py-1 rounded">
                Ocultar ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <p className="font-bold text-blue-800 dark:text-blue-400 mb-2">Diagrama de Tasas Equivalente (M/M/c)</p>
                <div className="font-mono text-center bg-white dark:bg-slate-950 p-3 border border-gray-200 dark:border-slate-700 rounded tracking-widest text-blue-800 dark:text-blue-400 font-bold leading-relaxed shadow-inner overflow-x-auto whitespace-pre">
                  [0] --λ--&gt; [1] --λ--&gt; [2] ... [c-1] --λ--&gt; [c] --λ--&gt; [c+1]<br />
                  [0] &lt;--μ-- [1] &lt;--2μ-- [2] ... &lt;--cμ-- [c] &lt;--cμ-- [c+1]
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 block mt-2 leading-relaxed">
                  * Estado n &lt; c: la tasa de servicio es nμ (servidores ocupados parcialmente). <br />
                  * Estado n ≥ c: la tasa de servicio es constante cμ (todas las taquillas saturadas en cola).
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-red-650 dark:text-red-400 mb-2">Criterio Estocástico de Optimización Económica</p>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Se implementa la función paramétrica de Costo Total Esperado por unidad de tiempo: 
                    <span className="block font-mono font-bold my-2 text-center bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900/50 p-2 rounded text-red-650 dark:text-red-400 text-sm shadow-inner">
                      ETC(c) = C1 · c + C2 · Ls
                    </span>
                    Donde se computa el balance óptimo entre la inversión de nómina de brigadistas (C1) y la penalización o coste humanitario por fatiga social en la intemperie (C2).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VISTA 1: PERSONAS (PASOS OFICIALES DE ATENCIÓN)
          ======================================================== */}
      {view === 'personas' && (
        <div className="max-w-4xl mx-auto p-6 w-full flex-grow animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm transition-all duration-300 ease-in-out">
            <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">Trámite de Contingencia</span>
            <h2 className="text-2xl font-black text-blue-900 dark:text-blue-450 mt-2 mb-4">Protocolo de Asignación de Plazas para Damnificados</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">Siga los pasos establecidos por el Ejecutivo Nacional y Protección Civil para tramitar de forma segura la reubicación tras el sismo.</p>
            
            <div className="space-y-4">
              <div className="flex space-x-4 border-l-4 border-red-650 pl-4 py-1">
                <div className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-black h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">Inspección de Habitabilidad</h4>
                  <p className="text-xs text-gray-650 dark:text-slate-350 mt-0.5">Comisiones de ingenieros evalúan su vivienda dañada. Si se dictamina riesgo inminente, recibirá el certificado de <strong>"Semáforo Rojo"</strong> (Inhabitable).</p>
                </div>
              </div>
              <div className="flex space-x-4 border-l-4 border-blue-600 pl-4 py-1">
                <div className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-black h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">Registro Único de Vivienda (Sistema Patria)</h4>
                  <p className="text-xs text-gray-650 dark:text-slate-300 mt-0.5 font-sans">Ingrese a la plataforma Patria Institución, cargue los datos de la inspección y valide su censo familiar, priorizando niños, adultos mayores y personas con discapacidad.</p>
                </div>
              </div>
              <div className="flex space-x-4 border-l-4 border-yellow-500 pl-4 py-1">
                <div className="bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-405 font-black h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">Emisión del Código QR</h4>
                  <p className="text-xs text-gray-650 dark:text-slate-300 mt-0.5">El sistema emitirá un comprobante digital con código QR. Este código garantiza de manera automática su cupo asignado en los macro-refugios oficiales.</p>
                </div>
              </div>
              <div className="flex space-x-4 border-l-4 border-emerald-600 pl-4 py-1">
                <div className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">Presentación en Frontera Logística</h4>
                  <p className="text-xs text-gray-650 dark:text-slate-300 mt-0.5">Trasládese por sus propios medios o en los transportes de Protección Civil al refugio. Al llegar, se escaneará su QR en las taquillas para asignarle su carpa familiar y kits de asistencia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VISTA 2: REFUGIOS ACTIVOS EN LA GUAIRA Y CARACAS
          ======================================================== */}
      {view === 'refugios' && (
        <div className="max-w-6xl mx-auto p-6 w-full flex-grow animate-fadeIn">
          <div className="mb-6">
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">Censo de Infraestructura</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-2">Red de Espacios Masivos de Alojamiento Temporal</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Inventario oficial de refugios y campamentos habilitados para la contingencia del sismo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* REFUGIOS LA GUAIRA */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm transition-all duration-300 ease-in-out">
              <h3 className="text-sm font-black uppercase text-blue-800 dark:text-blue-400 border-b dark:border-slate-700 pb-2 mb-4">📍 Estado La Guaira</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/60">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-slate-100">Campamento Masivo "Ciudad Carpita"</h4>
                    <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-[9px] font-black px-2 py-0.5 rounded">Capacidad: 1.500 Familias</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-300 mt-1"><strong>Ubicación:</strong> Mare Abajo, Parroquia Carlos Soublette. Hileras organizadas de carpas de campaña al aire libre con comedor comunitario centralizado.</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/60">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-slate-100">Polideportivo Adaptado de José María Vargas</h4>
                    <span className="bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-400 text-[9px] font-black px-2 py-0.5 rounded">Saturado (Cupos Limitados)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-300 mt-1"><strong>Ubicación:</strong> Av. Soublette, Maiquetía. Pabellones cubiertos compartidos habilitados para la atención médica inmediata y triaje inicial.</p>
                </div>
              </div>
            </div>

            {/* REFUGIOS CARACAS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm transition-all duration-300 ease-in-out">
              <h3 className="text-sm font-black uppercase text-red-650 dark:text-red-400 border-b dark:border-slate-700 pb-2 mb-4">📍 Distrito Capital (Caracas)</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/60">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-slate-100">Complejo Fuerte Tiuna - Galpones de Contingencia</h4>
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded">Capacidad: 2.000 Familias</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-300 mt-1"><strong>Ubicación:</strong> El Valle, Caracas. Estructuras techadas de gran capacidad militar optimizadas para el resguardo seguro de núcleos familiares extendidos.</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/60">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-slate-100">Gimnasio Vertical de El Poliedrito</h4>
                    <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-[9px] font-black px-2 py-0.5 rounded">Capacidad: 800 Familias</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-300 mt-1"><strong>Ubicación:</strong> La Rinconada. Espacio habilitado temporalmente con colchonetas, distribución guiada de alimentos y kits de higiene personal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VISTA 3: EL SIMULADOR DE COLAS ORIGINAL (PLAN DE CONTINGENCIA)
          ======================================================== */}
      {view === 'simulador' && (
        <>
          {/* BANNER HERO ORIGINAL DE PATRIA */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 dark:from-slate-800 dark:to-slate-950 text-white py-12 px-6 shadow-inner relative overflow-hidden transition-all duration-300 ease-in-out">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
              <div className="mb-6 md:mb-0 max-w-xl">
                <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Emergencia Estocástica</span>
                <h1 className="text-4xl font-extrabold mt-3">Bono Único Familiar: Registro Logístico</h1>
                <p className="text-sm text-blue-200 dark:text-slate-300 mt-2 leading-relaxed">
                  Monitoreo analítico y optimización de colas en el puesto de control fronterizo del refugio masivo <strong>"Ciudad Carpita" (La Guaira)</strong> tras el doblete sísmico nacional.
                </p>
              </div>
              <div className="bg-white/10 dark:bg-slate-700/20 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-slate-800 text-center text-xs">
                <span className="block font-bold uppercase text-yellow-400">Modelo Kendall Oficial</span>
                <span className="text-lg font-mono font-bold">M / M / c : GD / ∞ / ∞</span>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto p-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow animate-fadeIn">
            
            {/* FORMULARIO LATERAL IZQUIERDO */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden h-fit transition-all duration-300 ease-in-out">
              <div className="bg-red-600 dark:bg-red-750 text-white font-bold p-4 text-sm uppercase tracking-wider transition-colors">
                Variables de Contingencia (Patria Digital)
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-1">Tasa de Llegada (λ): <span className="text-blue-700 dark:text-blue-400 font-bold">{lam} fam/h</span></label>
                  <input type="range" min="5" max="60" step="0.1" value={lam} onChange={(e) => setLam(e.target.value)} className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer" />
                  <span className="text-[10px] text-gray-400 dark:text-slate-450 block mt-1">Inspección PC "Semáforo Rojo" cargados en Sistema Patria</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-1">Tasa de Servicio (μ): <span className="text-blue-700 dark:text-blue-400 font-bold">{mu} fam/h</span></label>
                  <input type="range" min="3" max="20" step="0.1" value={mu} onChange={(e) => setMu(e.target.value)} className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer" />
                  <span className="text-[10px] text-gray-400 dark:text-slate-450 block mt-1">Escaneo de QR, triaje médico y entrega de kits por mesa</span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400">Taquillas Activas (c):</label>
                    <button 
                      onClick={() => setAutoCalcularC(!autoCalcularC)}
                      className={`text-[10px] uppercase font-black px-2 py-1 rounded transition-colors ${autoCalcularC ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                    >
                      {autoCalcularC ? "⚙️ Auto Estabilidad" : "Manual"}
                    </button>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={c} 
                    disabled={autoCalcularC}
                    onChange={(e) => setC(e.target.value)} 
                    className={`w-full accent-red-650 dark:accent-red-500 ${autoCalcularC ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`} 
                  />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 block mt-1">{c} funcionarios desplegados</span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-slate-400 mb-1">Costo C1 ($/h):</label>
                    <input type="number" step="0.5" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2 rounded text-sm font-semibold text-gray-900 dark:text-slate-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-slate-400 mb-1">Costo Social C2 ($/h):</label>
                    <input type="number" step="1.0" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2 rounded text-sm font-semibold text-gray-900 dark:text-slate-100" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* CONTENEDOR DE DATOS DE SIMULACIÓN */}
            <div className="lg:col-span-2 space-y-6">
              
              {errorColapso && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-650 text-red-900 dark:text-red-300 p-5 rounded-r-xl shadow-sm">
                  <h3 className="font-bold text-base text-red-700 dark:text-red-400">Crisis Logística de Entrada Detectada</h3>
                  <p className="text-xs mt-1 leading-relaxed">{errorColapso}</p>
                </div>
              )}

              {resultado && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center transition-all duration-300 ease-in-out">
                      <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-wider">Familias en Portón (Ls)</p>
                      <p className="text-3xl font-black mt-2 text-blue-800 dark:text-blue-400">{resultado.configuracion_actual.ls} núcleos</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center transition-all duration-300 ease-in-out">
                      <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-wider">Tiempo Medio de Espera</p>
                      <p className="text-3xl font-black mt-2 text-red-650 dark:text-red-400">{resultado.configuracion_actual.wq_minutos} min</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center transition-all duration-300 ease-in-out">
                      <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase tracking-wider">ETC Absoluto del Impacto</p>
                      <p className="text-3xl font-black mt-2 text-gray-900 dark:text-slate-100">${resultado.configuracion_actual.etc}/h</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-sm transition-all duration-300 ease-in-out">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-blue-800 dark:text-blue-400 font-black text-base">Asignación Óptima Recomendada</h3>
                      <p className="text-xs text-gray-650 dark:text-slate-300 mt-1">Cálculo algorítmico minimizador del costo social bajo el sol caribeño y costos de operación.</p>
                    </div>
                    <div className="bg-blue-800 dark:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-lg shadow-md">
                      Abrir {resultado.optimo_sugerido.c_optimo} Taquillas
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">Matriz Estocástica de Sensibilidad Logística</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 uppercase text-[10px] text-center font-bold">
                          <tr>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Taquillas (c)</th>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Familias (Ls)</th>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Espera (Wq)</th>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Costo Operativo</th>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Impacto Social</th>
                            <th className="px-4 py-3 border-b dark:border-slate-700">Costo Total (ETC)</th>
                          </tr>
                        </thead>
                        <tbody className="text-center divide-y divide-gray-100 dark:divide-slate-705">
                          {resultado.analisis_sensibilidad.map((fila) => (
                            <tr key={fila.c} className={fila.c === resultado.optimo_sugerido.c_optimo ? "bg-blue-50/70 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-400" : "text-gray-600 dark:text-slate-300"}>
                              <td className="px-4 py-3 font-black">{fila.c} {fila.c === resultado.optimo_sugerido.c_optimo && "⭐"}</td>
                              <td className="px-4 py-3">{fila.ls}</td>
                              <td className="px-4 py-3">{fila.wq_minutos} min</td>
                              <td className="px-4 py-3">${fila.eoc}</td>
                              <td className="px-4 py-3">${fila.ewc}</td>
                              <td className="px-4 py-3 font-extrabold text-gray-950 dark:text-white">${fila.etc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </>
      )}

      {/* ========================================================
          PIE DE PÁGINA INSTITUCIONAL UNET
          ======================================================== */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6 px-4 text-center text-gray-500 dark:text-slate-400 text-xs mt-auto transition-all duration-300 ease-in-out">
        <div className="max-w-2xl mx-auto italic text-gray-600 dark:text-slate-350 font-medium">
          "No hay amor más grande que el que uno siente aquí en el pecho por una causa, por una patria, por una gente, por un pueblo, por la causa humana"
        </div>
        <div className="text-[10px] uppercase font-bold text-red-500 dark:text-red-400 mt-2 tracking-wider">
          Universidad Nacional Experimental del Táchira • Ingeniería Informática 2026
        </div>
      </footer>

    </div>
  );
}