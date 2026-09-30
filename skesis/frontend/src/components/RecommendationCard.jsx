const PRIORITY = { alta: "Prioridad alta", media: "Prioridad media", baja: "¡Bien!", info: "Primer paso" };

export default function RecommendationCard({ rec }) {
  return (
    <div className={`rec rec-${rec.priority}`}>
      <div className="rec-head">
        <strong>
          {rec.emoji ? `${rec.emoji} ` : ""}
          {rec.title}
        </strong>
        <span className="tag">{PRIORITY[rec.priority] || rec.priority}</span>
      </div>
      <p>{rec.text}</p>
      {rec.percent !== null && rec.percent !== undefined && rec.category && (
        <small className="muted">Cumplimiento semanal: {rec.percent}%</small>
      )}
    </div>
  );
}
