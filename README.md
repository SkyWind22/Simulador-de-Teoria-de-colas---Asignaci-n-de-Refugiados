# ⛺ MVP Colas: Gestión Humana "Ciudad Carpita"

### *Simulador de Optimización Estocástica para Refugios Post-Sismo (M/M/c)*

Este repositorio contiene el **Producto Mínimo Viable (MVP)** desarrollado para la materia de **Investigación de Operaciones II** (Ingeniería Informática, UNET - Julio 2026). El proyecto modela la asignación óptima de recursos en el centro de atención médica y entrega de insumos de emergencia **"Ciudad Carpita"**, un refugio temporal ficticio diseñado post-sismo en el estado **La Guaira, Venezuela**. 

---

## 🏛️ Contexto Humanitario y Matemático

Tras un evento sísmico en el litoral central de Venezuela, el flujo de damnificados que acuden al puesto central de asistencia humanitaria de **"Ciudad Carpita"** se incrementa de forma caótica. La toma de decisiones logísticas tradicionales puede llevar al colapso del sistema o a gastos insostenibles. 

Este simulador utiliza la teoría de colas bajo el modelo de estado estable de múltiples canales **$M/M/c$** y el **Análisis de Sensibilidad de Costos** para determinar la cantidad óptima de servidores o canales de servicio ($c$) requeridos.

### Variables Operativas Analizadas:
*   $\lambda$ (Tasa de Llegada): Flujo promedio de damnificados que ingresan al puesto de ayuda por unidad de tiempo.
*   $\mu$ (Tasa de Servicio): Velocidad de atención de cada canal/servidor (médico, trabajador social, o punto de distribución).
*   $c$ (Número de Canales): Servidores operativos activos simultáneamente.
*   $P_0$ (Probabilidad de Sistema Vacío): Fracción del tiempo en que los servidores están ociosos.
*   $L_s$ (Número promedio de personas en el sistema): Damnificados totales siendo atendidos o esperando en fila.
*   $W_q$ (Tiempo promedio de espera en la cola): Minutos promedio que pasa un damnificado en la cola antes de recibir atención.

### Optimización Económica-Social (Modelo de Costos):
El software calcula el **Costo Total Esperado por Unidad de Tiempo ($ETC$)** para determinar el punto óptimo económico y social:
$$ETC = C_1 \cdot c + C_2 \cdot L_s$$

Donde:
*   **$C_1$ (Costo del Servidor):** Gasto operativo asociado a mantener abierto un canal de atención (suministros, personal contratado, electricidad).
*   **$C_2$ (Costo de Espera):** Costo intangible/social de tener a un damnificado esperando (mayor riesgo de contagio, ansiedad social, demoras críticas de salud).

---

## ✨ Características Clave del MVP

-   **Algoritmo de Cálculo M/M/c en State Estable:** Backend matemático de alta fidelidad que evalúa la estabilidad del sistema mediante el factor de utilización:
    $$\rho = \frac{\lambda}{c \cdot \mu} < 1$$
-   **Switch de Auto-Estabilidad Inteligente:** El frontend y el backend bloquean y recalculan alternativas viables cuando $\rho \ge 1$ (punto de colapso de cola infinita).
-   **Sensibilidad de Costos Automatizada:** A partir de los costos parametrizados, evalúa de forma dinámica el comportamiento de la curva de costos $ETC$ analizando $c, c+1, c+2, c+3, c+4$ servidores y recomienda el idóneo.
-   **Entrada de Datos Decimales:** Flexibilidad total para introducir tasas fraccionarias (ej. $1.5$ personas/minuto).
-   **Diseño e Interfaz Visual "Patria":** IU web inmersiva que implementa **Tailwind CSS v4** adaptada al ecosistema estético institucional de plataformas gubernamentales de distribución pública de Venezuela (Patria), garantizando una experiencia de usuario familiar, sobria y funcional para situaciones críticas nacionales.

---

## 📂 Estructura del Proyecto

El repositorio está organizado de forma clara y desacoplada para facilitar el control de versiones y el despliegue rápido:

```yaml
PMV/
├── frontend/             # Frontend SPA en Vite + React 19 + Tailwind CSS v4
│   ├── src/              # Código fuente de las vistas y componentes de la UI (Patria CSS aesthetic)
│   ├── package.json      # Dependencias de Node.js
│   ├── index.html        # Plantilla base HTML5
│   └── vite.config.js    # Configuración del bundler Vite
├── main.py               # Motor analítico RESTful en Python (FastAPI / Uvicorn)
├── .gitignore            # Archivo de exclusión para Git (node_modules, venv, caches, temporal files)
└── README.md             # Documentación estructurada del simulador (este archivo)
```

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos sencillos pasos para levantar los servicios del simulador en un ambiente local de desarrollo.

### 🐍 Requisitos Previos:
- [Node.js](https://nodejs.org/) (versión 18+ recomendada)
- [Python](https://www.python.org/) (versión 3.9+)
- Administrador de paquetes `npm` (incluido con Node.js) y `pip` (incluido con Python)

---

### **1. Levantamiento del Backend (FastAPI)**

Abra una terminal en la carpeta raíz del proyecto y ejecute los siguientes comandos:

1. **Crear y activar un entorno virtual (Recomendado):**
   *   **En Windows (PowerShell/CMD):**
       ```bash
       python -m venv venv
       .\venv\Scripts\activate
       ```
   *   **En macOS/Linux:**
       ```bash
       python3 -m venv venv
       source venv/bin/activate
       ```

2. **Instalar Dependencias Requeridas:**
   Instale el framework web y el servidor ASGI compatible:
   ```bash
   pip install fastapi uvicorn pydantic
   ```

3. **Iniciar el Servidor de Desarrollo:**
   ```bash
   uvicorn main:app --reload
   ```
   *   El backend comenzará a ejecutarse en: `http://127.0.0.1:8000`
   *   Puedes revisar la documentación interactiva autogenerada de la API en: `http://127.0.0.1:8000/docs`

---

### **2. Levantamiento del Frontend (Vite + React)**

Abra una terminal secundaria independiente en el directorio `/frontend` y ejecute:

1. **Instalar Dependencias de Node:**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar en modo Desarrollo:**
   ```bash
   npm run dev
   ```
   *   El frontend iniciará inmediatamente y mostrará la dirección local en la terminal (usualmente `http://localhost:5173`).
   *   Abra dicho enlace en su navegador para interactuar con la aplicación.

---

## 👥 Equipo de Desarrollo y Materia

*   **Asignatura:** Investigación de Operaciones II (Investigación Operativa - Colas)
*   **Institución:** Universidad Nacional Experimental del Táchira (UNET)
*   **Carrera:** Ingeniería Informática
*   **Fecha de Entrega:** Julio 2026

*Desarrollado bajo principios de resiliencia civil y optimización científica aplicada a la gestión de desastres nacionales.*
