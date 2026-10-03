import { useMemo } from 'react';
import { clock } from '../api';

const W = 960, H = 150;

export default function Chart({ stats, win, onZoom }) {
  const { cols, size } = useMemo(() => {
    if (!stats || !win) return { cols: [], size: 0 };
    const size = stats.bucketMs;
    const start = Math.floor(win.from / size) * size;
    const n = Math.max(1, Math.ceil((win.to - start) / size));
    const byT = Object.fromEntries(stats.series.map((s) => [s.t, s.levels]));
    const cols = [];
    let max = 1;
    for (let i = 0; i < n; i++) {
      const t = start + i * size;
      const L = byT[t] || {};
      const e = (L.error || 0) + (L.fatal || 0);
      const w = L.warn || 0;
      const total = Object.values(L).reduce((s, v) => s + v, 0);
      cols.push({ t, e, w, o: total - e - w, total });
      max = Math.max(max, total);
    }
    return { cols: cols.map((c) => ({ ...c, max })), size };
  }, [stats, win]);

  const bw = cols.length ? W / cols.length : W;

  return (
    <div className="panel" id="chartWrap">
      <svg id="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Log volume over time">
        {cols.map((c, i) => {
          const x = i * bw + 1, w = Math.max(1, bw - 2);
          const hE = (c.e / c.max) * H, hW = (c.w / c.max) * H, hO = (c.o / c.max) * H;
          return (
            <g key={c.t} onClick={() => onZoom({ from: c.t, to: c.t + size })}>
              <title>{`${clock(c.t, true)}: ${c.total} logs, ${c.e} errors`}</title>
              <rect className="b" x={x} y={H - hE} width={w} height={hE} fill="#B3261E" />
              <rect className="b" x={x} y={H - hE - hW} width={w} height={hW} fill="#B7791F" />
              <rect className="b" x={x} y={H - hE - hW - hO} width={w} height={hO} fill="#9FB3C8" />
            </g>
          );
        })}
      </svg>
      <div className="hint">
        <span>{win && clock(win.from, true)}</span>
        <span>Click a bar to zoom into that period</span>
        <span>{win && clock(win.to, true)}</span>
      </div>
    </div>
  );
}
