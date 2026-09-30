const formatDate = (str) => {
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
};

export default function HabitCard({ habit, category, onDelete }) {
  return (
    <div className="habit-card">
      <div className="habit-icon">{category?.emoji || "•"}</div>
      <div className="habit-info">
        <strong>{category?.label || habit.category}</strong>
        <span>
          {habit.amount} {category?.unit} · {formatDate(habit.date)}
        </span>
        {habit.note && <em className="muted">{habit.note}</em>}
      </div>
      {onDelete && (
        <button className="btn-icon" onClick={() => onDelete(habit._id)} aria-label="Eliminar registro" title="Eliminar">
          ✕
        </button>
      )}
    </div>
  );
}
