import { getProgress } from "./progress.service.js";
import { getRecommendations } from "./recommendation.service.js";

// Quita tildes y pasa a minúsculas para comparar palabras clave.
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const has = (text, words) => words.some((w) => text.includes(w));

const ADVICE = {
  sueno: "Para dormir mejor: horario fijo para acostarte, sin pantallas 30 min antes y una habitación oscura y fresca. La meta son 8 horas.",
  ejercicio: "Para el ejercicio: parte con 30 minutos de caminata rápida al día o pausas activas de 5 minutos cada hora. Lo importante es la constancia.",
  agua: "Para hidratarte: lleva siempre una botella, toma un vaso al despertar y uno con cada comida. La meta son 8 vasos al día.",
  alimentacion: "Para comer mejor: apunta a 5 porciones de frutas y verduras al día y reemplaza snacks procesados por fruta o frutos secos.",
  descanso: "Para el estrés: prueba 15 minutos diarios de respiración profunda, meditación o desconexión de pantallas. Ayuda mucho en época de pruebas.",
};

export async function getAssistantReply(message) {
  const text = normalize(message);
  if (!text.trim()) return "Escribe tu pregunta y te ayudo. Por ejemplo: «¿cómo voy hoy?» o «dame consejos para dormir mejor».";

  if (has(text, ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes"])) {
    return "¡Hola! Soy el asistente de Skesis. Puedo contarte cómo vas con tus hábitos, darte recomendaciones y consejos sobre sueño, ejercicio, agua, alimentación o estrés. ¿Qué necesitas?";
  }

  if (has(text, ["gracias", "chao", "adios", "hasta luego"])) {
    return "¡De nada! Sigue registrando tus hábitos, la constancia es lo que más importa. 💪";
  }

  if (has(text, ["ayuda", "que puedes", "que sabes", "como funcionas"])) {
    return "Puedo: 1) resumir tu progreso de hoy y de la semana, 2) darte recomendaciones según tus registros, 3) darte consejos de sueño, ejercicio, agua, alimentación y estrés. Pregúntame lo que quieras.";
  }

  // Consejos por categoría
  if (has(text, ["dormir", "sueno", "insomnio", "descanso nocturno", "cansad"])) return ADVICE.sueno;
  if (has(text, ["ejercicio", "deporte", "entrenar", "caminar", "sedentar", "actividad fisica", "moverme"])) return ADVICE.ejercicio;
  if (has(text, ["agua", "hidrat", "beber", "tengo sed"])) return ADVICE.agua;
  if (has(text, ["comer", "alimenta", "dieta", "fruta", "verdura", "comida"])) return ADVICE.alimentacion;
  if (has(text, ["estres", "ansiedad", "meditar", "relaj", "mental", "agobi"])) return ADVICE.descanso;

  // Progreso
  if (has(text, ["progreso", "como voy", "resumen", "avance", "hoy", "semana", "racha"])) {
    const p = await getProgress(7);
    if (p.totalRecords === 0) return "Aún no tienes hábitos registrados. Ve a «Registrar hábito» y anota el primero; luego te muestro tu progreso.";
    const best = [...p.averages].sort((a, b) => b.average - a.average)[0];
    const worst = [...p.averages].sort((a, b) => a.average - b.average)[0];
    return (
      `Hoy llevas ${p.today.percent}% de tus metas diarias y tu promedio de los últimos 7 días es ${p.periodAverage}%. ` +
      `Tu racha es de ${p.streak} día(s) seguidos con registros. ` +
      `Tu mejor categoría es ${best.label} (${best.average}%) y la que más puedes mejorar es ${worst.label} (${worst.average}%).`
    );
  }

  // Recomendaciones
  if (has(text, ["recomend", "consejo", "sugerencia", "mejorar", "que hago", "que deberia"])) {
    const recs = await getRecommendations();
    const top = recs.slice(0, 2).map((r) => `• ${r.title}: ${r.text}`);
    return `Según tus registros, te recomiendo:\n${top.join("\n")}`;
  }

  return "No estoy seguro de haber entendido. Prueba con: «¿cómo voy hoy?», «dame recomendaciones», «consejos para dormir mejor» o «ayuda».";
}
