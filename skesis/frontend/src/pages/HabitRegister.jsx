import { useEffect, useState } from "react";
import { createHabit, deleteHabit, getCategories, getHabits } from "../services/api.js";
import HabitCard from "../components/HabitCard.jsx";

function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function HabitRegister() {
  const [categories, setCategories] = useState([]);
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", date: todayStr(), note: "" });
  const [message, setMessage] = useState(null); // { type, text }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getHabits()])
      .then(([cats, list]) => {
        setCategories(cats);
        setHabits(list);
        setForm((f) => ({ ...f, category: cats[0]?.key || "" }));
      })
      .catch((err) => setMessage({ type: "error", text: err.message }));
  }, []);

  const selected = categories.find((c) => c.key === form.category);
  const byKey = Object.fromEntries(categories.map((c) => [c.key, c]));

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Ingresa una cantidad mayor que 0." });
      return;
    }
    setSaving(true);
    try {
      await createHabit({ ...form, amount });
      setHabits(await getHabits());
      setForm((f) => ({ ...f, amount: "", note: "" }));
      setMessage({ type: "ok", text: "¡Hábito registrado!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await deleteHabit(id);
      setHabits((list) => list.filter((h) => h._id !== id));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  return (
    <section>
      <h1>Registrar hábito</h1>

      <div className="grid two">
        <form className="card form" onSubmit={handleSubmit}>
          <label>
            Categoría
            <select value={form.category} onChange={update("category")}>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cantidad {selected ? `(${selected.unit})` : ""}
            <input
              type="number"
              min="0"
              step="any"
              max={selected?.max}
              value={form.amount}
              onChange={update("amount")}
              placeholder={selected ? `Meta diaria: ${selected.goal} ${selected.unit}` : ""}
              required
            />
          </label>

          <label>
            Fecha
            <input type="date" value={form.date} max={todayStr()} onChange={update("date")} required />
          </label>

          <label>
            Nota (opcional)
            <input type="text" value={form.note} onChange={update("note")} maxLength={200} placeholder="Ej: caminata después de clases" />
          </label>

          {message && <p className={`alert ${message.type}`}>{message.text}</p>}

          <button className="btn" type="submit" disabled={saving || !form.category}>
            {saving ? "Guardando..." : "Guardar hábito"}
          </button>
        </form>

        <div className="card">
          <h3>Historial</h3>
          {habits.length === 0 ? (
            <p className="muted">Todavía no hay registros.</p>
          ) : (
            habits.slice(0, 15).map((h) => <HabitCard key={h._id} habit={h} category={byKey[h.category]} onDelete={handleDelete} />)
          )}
        </div>
      </div>
    </section>
  );
}
