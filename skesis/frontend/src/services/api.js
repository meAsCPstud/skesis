const BASE_URL = "/api";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ocurrió un error inesperado");
  return data;
}

export const getCategories = () => request("/categories");
export const getHabits = () => request("/habits");
export const createHabit = (habit) => request("/habits", { method: "POST", body: JSON.stringify(habit) });
export const deleteHabit = (id) => request(`/habits/${id}`, { method: "DELETE" });
export const getProgress = (days = 7) => request(`/progress?days=${days}`);
export const getRecommendations = () => request("/recommendations");
export const sendMessage = (message) => request("/assistant", { method: "POST", body: JSON.stringify({ message }) });
