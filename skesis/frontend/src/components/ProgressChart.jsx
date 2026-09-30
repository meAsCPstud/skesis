// Gráfico de barras del cumplimiento diario (0-100%). Sin librerías externas.
export default function ProgressChart({ daily }) {
  const dense = daily.length > 10;
  return (
    <div className="chart" role="img" aria-label="Gráfico de cumplimiento diario">
      {daily.map((d) => (
        <div className="chart-col" key={d.date}>
          <span className="chart-value">{d.hasData ? `${d.percent}%` : ""}</span>
          <div className="chart-track">
            <div className="chart-bar" style={{ height: `${d.percent}%` }} title={`${d.date}: ${d.percent}%`} />
          </div>
          <span className="chart-label">{dense ? d.date.slice(8) : d.label}</span>
        </div>
      ))}
    </div>
  );
}
