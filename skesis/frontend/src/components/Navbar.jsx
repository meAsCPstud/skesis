import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/registrar", label: "Registrar hábito" },
  { to: "/progreso", label: "Progreso" },
  { to: "/asistente", label: "Asistente" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <span className="logo">🌱 Skesis</span>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
