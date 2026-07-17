import React, { useState, useEffect } from 'react';

export default function App() {
  // Estados con números decimales permitidos
  const [lam, setLam] = useState(19.7); 
  const [mu, setMu] = useState(9.4);   
  const [c, setC] = useState(4);     
  const [c1, setC1] = useState(15.0);   
  const [c2, setC2] = useState(120.0);  

  const [autoCalcularC, setAutoCalcularC] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errorColapso, setErrorColapso] = useState("");

  useEffect(() => {
    if (autoCalcularC) {
      const cMinimo = Math.floor(lam / mu) + 1;
      setC(cMinimo);
    }
  }, [lam, mu, autoCalcularC]);

  useEffect(() => {
    if (c <= lam / mu) {
      setErrorColapso(`⚠️ ALERTA LOGÍSTICA: Servidores insuficientes (c ≤ λ/μ). El portón de ingreso a "Ciudad Carpita" colapsará administrativamente. Se requiere un mínimo de ${Math.floor(lam / mu) + 1} taquillas.`);
      setResultado(null);
      return;
    }
    
    setErrorColapso("");

    fetch('http://127.0.0.1:8000/simulate', {
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
    .then(data => setResultado(data))
    .catch(err => console.error(err));
  }, [lam, mu, c, c1, c2]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      
      {/* BANNER SUPERIOR INSTITUTIONAL PATRIA */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tighter text-blue-800 flex items-center">
              <span className="text-yellow-500">🇻🇪</span> PATRIA<span className="text-xs font-semibold text-gray-500 ml-2 tracking-normal border-l pl-2">Institución</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-6 text-xs font-bold uppercase text-gray-600">
            <span className="hover:text-blue-700 cursor-pointer">Persona</span>
            <span className="hover:text-blue-700 cursor-pointer">Institución</span>
            <span className="hover:text-blue-700 cursor-pointer text-red-600">Plan de Contingencia</span>
          </nav>
        </div>
      </header>

      {/* BANNER HERO DE SENSABILIZACIÓN POST-SISMO */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12 px-6 shadow-inner relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="mb-6 md:mb-0 max-w-xl">
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Emergencia Estocástica</span>
            <h1 className="text-4xl font-extrabold mt-3">Bono Único Familiar: Registro Logístico</h1>
            <p className="text-sm text-blue-200 mt-2 leading-relaxed">
              Monitoreo analítico y optimización de colas en el puesto de control fronterizo del refugio masivo <strong>"Ciudad Carpita" (La Guaira)</strong> tras el doblete sísmico nacional.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center text-xs">
            <span className="block font-bold uppercase text-yellow-400">Modelo Kendall Oficial</span>
            <span className="text-lg font-mono font-bold">M / M / c : GD / ∞ / ∞</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL EN FORMATO BLOQUES */}
      <main className="max-w-7xl mx-auto p-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        
        {/* FILTRO IZQUIERDO: VARIABLES EN CUADROS TIPO FORMULARIO */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-fit">
          <div className="bg-red-600 text-white font-bold p-4 text-sm uppercase tracking-wider">
            Variables de Contingencia (Patria Digital)
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tasa de Llegada (λ): <span className="text-blue-700 font-bold">{lam} fam/h</span></label>
              <input type="range" min="5" max="60" step="0.1" value={lam} onChange={(e) => setLam(e.target.value)} className="w-full accent-blue-700 cursor-pointer" />
              <span className="text-[10px] text-gray-400 block mt-1">Inspección PC "Semáforo Rojo" cargados en Sistema Patria</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tasa de Servicio (μ): <span className="text-blue-700 font-bold">{mu} fam/h</span></label>
              <input type="range" min="3" max="20" step="0.1" value={mu} onChange={(e) => setMu(e.target.value)} className="w-full accent-blue-700 cursor-pointer" />
              <span className="text-[10px] text-gray-400 block mt-1">Escaneo de QR, triaje médico y entrega de kits por mesa</span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase text-gray-500">Taquillas Activas (c):</label>
                <button 
                  onClick={() => setAutoCalcularC(!autoCalcularC)}
                  className={`text-[10px] uppercase font-black px-2 py-1 rounded transition-colors ${autoCalcularC ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                className={`w-full accent-red-600 ${autoCalcularC ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`} 
              />
              <span className="text-xs font-bold text-red-600 block mt-1">{c} funcionarios desplegados</span>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Costo C1 ($/h):</label>
                <input type="number" step="0.5" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full bg-gray-50 border p-2 rounded text-sm font-semibold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Costo Social C2 ($/h):</label>
                <input type="number" step="1.0" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full bg-gray-50 border p-2 rounded text-sm font-semibold" />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENEDOR DERECHO: SIMULACIÓN INTERACTIVA */}
        <div className="lg:col-span-2 space-y-6">
          
          {errorColapso && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-900 p-5 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-base text-red-700">Crisis Logística de Entrada Detectada</h3>
              <p className="text-xs mt-1 leading-relaxed">{errorColapso}</p>
            </div>
          )}

          {resultado && (
            <>
              {/* BLOQUES DE MÉTRICAS - CORREGIDO EL BUG DEL COSTO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Familias en Portón (Ls)</p>
                  <p className="text-3xl font-black mt-2 text-blue-800">{resultado.configuracion_actual.ls} núcleos</p>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tiempo Medio de Espera</p>
                  <p className="text-3xl font-black mt-2 text-red-600">{resultado.configuracion_actual.wq_minutos} min</p>
                </div>
                <div className="bg-white p-5 rounded-xl border shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ETC Absoluto del Impacto</p>
                  <p className="text-3xl font-black mt-2 text-gray-900">${resultado.configuracion_actual.etc}/h</p>
                </div>
              </div>

              {/* RECOMENDACIÓN TOTALMENTE VISUAL */}
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-sm">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-blue-800 font-black text-base">Asignación Óptima Recomendada</h3>
                  <p className="text-xs text-gray-600 mt-1">Cálculo algorítmico minimizador del costo social bajo el sol caribeño y costos de operación.</p>
                </div>
                <div className="bg-blue-800 text-white px-6 py-3 rounded-xl font-black text-lg shadow-md">
                  Abrir {resultado.optimo_sugerido.c_optimo} Taquillas
                </div>
              </div>

              {/* TABLA DE ANÁLISIS DE SENSIBILIDAD OPERATIVA */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Matriz Estocástica de Sensibilidad Logística</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] text-center font-bold">
                      <tr>
                        <th className="px-4 py-3 border-b">Taquillas (c)</th>
                        <th className="px-4 py-3 border-b">Familias (Ls)</th>
                        <th className="px-4 py-3 border-b">Espera (Wq)</th>
                        <th className="px-4 py-3 border-b">Costo Operativo</th>
                        <th className="px-4 py-3 border-b">Impacto Social</th>
                        <th className="px-4 py-3 border-b">Costo Total (ETC)</th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-100">
                      {resultado.analisis_sensibilidad.map((fila) => (
                        <tr key={fila.c} className={fila.c === resultado.optimo_sugerido.c_optimo ? "bg-blue-50/70 font-bold text-blue-900" : "text-gray-600"}>
                          <td className="px-4 py-3 font-black">{fila.c} {fila.c === resultado.optimo_sugerido.c_optimo && "⭐"}</td>
                          <td className="px-4 py-3">{fila.ls}</td>
                          <td className="px-4 py-3">{fila.wq_minutos} min</td>
                          <td className="px-4 py-3">${fila.eoc}</td>
                          <td className="px-4 py-3">${fila.ewc}</td>
                          <td className="px-4 py-3 font-extrabold text-gray-950">${fila.etc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 🌟 NUEVA SECCIÓN DE SUSTENTO TEÓRICO PARA LA EVALUACIÓN 🌟 */}
              <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-2">
                  Ficha Técnica: Formulación Científica del Modelo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="font-bold text-gray-700 mb-2">Diagrama de Tasas Equivalente</p>
                    <div className="font-mono text-center bg-white p-2 border rounded tracking-widest text-blue-800 font-bold">
                      [0] --λ--&gt; [1] --λ--&gt; [2] ... [c-1] --λ--&gt; [c] --λ--&gt; [c+1]
                      <br />
                      [0] &lt;--μ-- [1] &lt;--2μ-- [2] ... &lt;--cμ-- [c] &lt;--cμ-- [c+1]
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-2 leading-relaxed">
                      * Estado n &lt; c: la tasa de servicio es nμ (servidores ociosos). <br />
                      * Estado n ≥ c: la tasa de servicio es constante cμ (todas las taquillas saturadas).
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-gray-700 mb-1">Criterio Estocástico de Optimización</p>
                      <p className="text-gray-600 leading-relaxed text-[11px]">
                        Se implementa la función de Costo Total Esperado por unidad de tiempo: 
                        <span className="block font-mono font-bold my-1 text-center bg-white border p-1 rounded text-red-600">
                          ETC(c) = C1 · c + C2 · Ls
                        </span>
                        Donde se busca el balance óptimo entre la inversión de nómina de brigadistas (C1) y la penalización humanitaria por fatiga social en la intemperie (C2).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </main>

      {/* CITA INSTITUCIONAL AL PIE DE PÁGINA */}
      <footer className="bg-white border-t py-6 px-4 mt-12 text-center text-gray-500 text-xs">
        <div className="max-w-2xl mx-auto italic text-gray-600 font-medium">
          "No hay amor más grande que el que uno siente aquí en el pecho por una causa, por una patria, por una gente, por un pueblo, por la causa humana"
        </div>
        <div className="text-[10px] uppercase font-bold text-red-500 mt-2 tracking-wider">
          Universidad Nacional Experimental del Táchira • Ingeniería Informática 2026
        </div>
      </footer>

    </div>
  );
}