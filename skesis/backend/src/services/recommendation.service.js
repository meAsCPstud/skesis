import { getProgress } from "./progress.service.js";

const TIPS = {
  sueno: {
    title: "Mejora tu descanso nocturno",
    text: "Intenta acostarte a la misma hora todos los días y evita pantallas 30 minutos antes de dormir. Apunta a 8 horas de sueño.",
  },
  ejercicio: {
    title: "Muévete un poco más",
    text: "Suma al menos 30 minutos de actividad al día: una caminata rápida entre clases o unas pausas activas cada hora sentado.",
  },
  agua: {
    title: "Hidrátate durante el día",
    text: "Deja una botella de agua en tu mochila y toma un vaso al despertar, otro en cada descanso y uno con cada comida.",
  },
  alimentacion: {
    title: "Come más frutas y verduras",
    text: "Intenta llegar a 5 porciones al día. Lleva una fruta como colación en lugar de snacks procesados.",
  },
  descanso: {
    title: "Dale una pausa a tu mente",
    text: "Dedica 15 minutos al día a respirar profundo, meditar o simplemente desconectarte del computador para bajar el estrés.",
  },
};

export async function getRecommendations() {
  const p = await getProgress(7);

  if (p.totalRecords === 0) {
    return [
      {
        category: null,
        priority: "info",
        title: "Empieza registrando tu primer hábito",
        text: "Registra tu sueño, ejercicio, agua, alimentación o descanso mental y te daré recomendaciones personalizadas.",
        percent: null,
      },
    ];
  }

  const weak = p.averages
    .filter((c) => c.average < 70)
    .sort((a, b) => a.average - b.average)
    .map((c) => ({
      category: c.key,
      emoji: c.emoji,
      label: c.label,
      priority: c.average < 40 ? "alta" : "media",
      title: TIPS[c.key].title,
      text: TIPS[c.key].text,
      percent: c.average,
    }));

  if (weak.length === 0) {
    return [
      {
        category: null,
        priority: "baja",
        title: "¡Excelente trabajo!",
        text: "Estás cumpliendo tus metas de la semana en todas las categorías. Sigue así y mantén tu racha.",
        percent: p.periodAverage,
      },
    ];
  }

  return weak;
}
