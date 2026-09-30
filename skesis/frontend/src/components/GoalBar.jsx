// Barra de avance de una categoría respecto a su meta diaria.
export default function GoalBar({ emoji, label, total, goal, unit, percent }) {
  const level = percent >= 100 ? "done" : percent >= 50 ? "mid" : "low";
  return (
    <div className="goal">
      <div className="goal-head">
        <span>
          {emoji} {label}
        </span>
        <span className="muted">
          {total} / {goal} {unit}
        </span>
      </div>
      <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={`bar-fill ${level}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
