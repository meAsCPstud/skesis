import { useEffect, useState } from "react";
import { getProgress } from "../services/api.js";
import ProgressChart from "../components/ProgressChart.jsx";
import GoalBar from "../components/GoalBar.jsx";

const RANGES = [7, 14, 30];

export default function Progress() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getProgress(days)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [days]);

  if (error) return <p className="alert error">{error}</p>;
  if (!data) return <p className="muted">Cargando...</p>;

  return (
    <section>
      <h1>Progreso</h1>

      <div className="range">
        {RANGES.map((r) => (
          <button key={r} className={r === days ? "chip active" : "chip"} onClick={() => setDays(r)}>
            {r} días
          </button>
        ))}
      </div>

      <div className="stats">
        <div className="card stat">
          <span className="stat-num">{data.periodAverage}%</span>
          <span className="muted">Promedio del periodo</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{data.streak}</span>
          <span className="muted">Días de racha</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{data.totalRecords}</span>
          <span className="muted">Registros totales</span>
        </div>
      </div>

      <div className="card">
        <h3>Cumplimiento diario</h3>
        <ProgressChart daily={data.daily} />
        {data.totalRecords === 0 && <p className="muted">Registra hábitos para ver tu progreso aquí.</p>}
      </div>

      <div className="card">
        <h3>Promedio por categoría ({days} días)</h3>
        {data.averages.map((c) => (
          <GoalBar key={c.key} emoji={c.emoji} label={c.label} total={`${c.average}%`} goal="100%" unit="" percent={c.average} />
        ))}
        <small className="muted">Solo se promedian los días con registros.</small>
      </div>
    </section>
  );
}
