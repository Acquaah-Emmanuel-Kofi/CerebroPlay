export interface RadarChartAxis {
  label: string;
  value: number;
}

interface RadarChartProps {
  axes: RadarChartAxis[];
  size?: number;
}

const RINGS = [0.25, 0.5, 0.75, 1];

export function RadarChart({ axes, size = 240 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 28;

  function pointFor(index: number, fraction: number) {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const radius = maxRadius * fraction;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  }

  const dataPoints = axes.map((axis, i) => pointFor(i, Math.max(0, Math.min(100, axis.value)) / 100));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Brain profile radar chart">
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={axes.map((_, i) => pointFor(i, ring)).map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="var(--color-surface-container-highest)"
          strokeWidth={1}
        />
      ))}
      {axes.map((axis, i) => {
        const p = pointFor(i, 1);
        return (
          <line
            key={axis.label}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-surface-container-highest)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="var(--color-primary)"
        fillOpacity={0.25}
        stroke="var(--color-primary)"
        strokeWidth={2}
      />
      {dataPoints.map((p, i) => (
        <circle key={axes[i].label} cx={p.x} cy={p.y} r={3} fill="var(--color-primary)" />
      ))}
      {axes.map((axis, i) => {
        const labelPoint = pointFor(i, 1.22);
        return (
          <text
            key={axis.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fill="var(--color-on-surface-variant)"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
