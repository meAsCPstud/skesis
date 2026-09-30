import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HabitRegister from "./pages/HabitRegister.jsx";
import Progress from "./pages/Progress.jsx";
import Assistant from "./pages/Assistant.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registrar" element={<HabitRegister />} />
          <Route path="/progreso" element={<Progress />} />
          <Route path="/asistente" element={<Assistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
