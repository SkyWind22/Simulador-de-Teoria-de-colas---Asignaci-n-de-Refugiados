import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Motor Analitico de Colas - UNET IO-II")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationInput(BaseModel):
    lam: float
    mu: float
    c: int
    c1: float
    c2: float

def calcular_metricas_mmc(lam: float, mu: float, c: int, c1: float, c2: float):
    rho = lam / (c * mu)
    if rho >= 1:
        return None

    # Sumatoria estricta M/M/c
    suma_p0 = sum([(lam / mu) ** n / math.factorial(n) for n in range(c)])
    termino_c = ((lam / mu) ** c) / (math.factorial(c) * (1 - rho))
    p0 = 1 / (suma_p0 + termino_c)

    numerador_lq = (p0 * ((lam / mu) ** c) * rho)
    denominador_lq = (math.factorial(c) * ((1 - rho) ** 2))
    lq = numerador_lq / denominador_lq

    ls = lq + (lam / mu)
    wq = lq / lam
    wq_minutos = wq * 60

    eoc = c1 * c
    ewc = c2 * ls
    etc = eoc + ewc

    return {
        "c": c,
        "ls": round(ls, 3),
        "wq_minutos": round(wq_minutos, 2),
        "eoc": round(eoc, 2),
        "ewc": round(ewc, 2),
        "etc": round(etc, 2)
    }

@app.post("/simulate")
@app.post("/api/simulate")
def simulate(data: SimulationInput):
    actual = calcular_metricas_mmc(data.lam, data.mu, data.c, data.c1, data.c2)
    
    c_minimo_estable = math.floor(data.lam / data.mu) + 1
    sensibilidad = []
    c_optimo = c_minimo_estable
    costo_minimo = float('inf')

    for c_eval in range(c_minimo_estable, c_minimo_estable + 5):
        res = calcular_metricas_mmc(data.lam, data.mu, c_eval, data.c1, data.c2)
        if res:
            sensibilidad.append(res)
          
            if res["etc"] < costo_minimo:
                costo_minimo = res["etc"]
                c_optimo = c_eval

    return {
        "configuracion_actual": actual if actual else {
            "ls": "COLLAPSE", "wq_minutos": "INF", "costo_total": "INF"
        },
        "analisis_sensibilidad": sensibilidad,
        "optimo_sugerido": {
            "c_optimo": c_optimo,
            "costo_minimo": round(costo_minimo, 2)
        }
    }
