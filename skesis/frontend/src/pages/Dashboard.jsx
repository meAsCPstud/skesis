import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getHabits, getProgress, getRecommendations } from "../services/api.js";
import GoalBar from "../components/GoalBar.jsx";
import HabitCard from "../components/HabitCard.jsx";
import ProgressChart from "../components/ProgressChart.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCategories(), getHabits(), getProgress(7), getRecommendations()])
      .then(([categories, habits, progress, recs]) => setData({ categories, habits, progress, recs }))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="alert error">{error}</p>;
  if (!data) return <p className="muted">Cargando...</p>;

  const { categories, habits, progress, recs } = data;
  const byKey = Object.fromEntries(categories.map((c) => [c.key, c]));

  return (
    <section>
      <h1>Bienvenido a Skesis</h1>
      <p className="muted">Tu panel de hábitos saludables.</p>

      <div className="stats">
        <div className="card stat">
          <span className="stat-num">{progress.today.percent}%</span>
          <span className="muted">Metas de hoy</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{progress.streak}</span>
          <span className="muted">Días de racha</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{progress.periodAverage}%</span>
          <span className="muted">Promedio semanal</span>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h3>Metas de hoy</h3>
          {progress.today.categories.map((c) => (
            <GoalBar key={c.key} {...c} />
          ))}
          <Link className="btn" to="/registrar">
            + Registrar hábito
          </Link>
        </div>

        <div className="card">
          <h3>Últimos 7 días</h3>
          <ProgressChart daily={progress.daily} />
          <Link className="link-inline" to="/progreso">
            Ver progreso completo →
          </Link>
        </div>

        <div className="card">
          <h3>Registros recientes</h3>
          {habits.length === 0 ? (
            <p className="muted">Aún no has registrado hábitos.</p>
          ) : (
            habits.slice(0, 4).map((h) => <HabitCard key={h._id} habit={h} category={byKey[h.category]} />)
          )}
        </div>

        <div className="card">
          <h3>Recomendaciones</h3>
          {recs.slice(0, 2).map((r, i) => (
            <RecommendationCard key={i} rec={r} />
          ))}
          <Link className="link-inline" to="/asistente">
            Hablar con el asistente →
          </Link>
        </div>
      </div>
    </section>
  );
}
