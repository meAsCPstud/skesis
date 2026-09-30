import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/api.js";

const SUGGESTIONS = ["¿Cómo voy hoy?", "Dame recomendaciones", "Consejos para dormir mejor", "Ayuda"];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy tu asistente de hábitos saludables. Pregúntame por tu progreso o pídeme consejos." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function send(text) {
    const msg = text.trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { from: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await sendMessage(msg);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="chat card">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bubble bot muted">Escribiendo...</div>}
        <div ref={endRef} />
      </div>

      <div className="suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => send(s)} disabled={loading}>
            {s}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          maxLength={300}
          aria-label="Mensaje"
        />
        <button className="btn" type="submit" disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}
