import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api.js";
import ChatAssistant from "../components/ChatAssistant.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";

export default function Assistant() {
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecommendations()
      .then(setRecs)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1>Asistente y recomendaciones</h1>
      <div className="grid two">
        <ChatAssistant />
        <div className="card">
          <h3>Recomendaciones para ti</h3>
          {error && <p className="alert error">{error}</p>}
          {recs.map((r, i) => (
            <RecommendationCard key={i} rec={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
