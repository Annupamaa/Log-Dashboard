import { useEffect, useState } from 'react';
import { getLogs, getStats, clock } from './api';
import Chart from './components/Chart';
import LogTable from './components/LogTable';
import AskPanel from './components/AskPanel';

const RANGES = [
  [900000, 'Last 15 minutes'],
  [3600000, 'Last hour'],
  [21600000, 'Last 6 hours'],
  [86400000, 'Last 24 hours'],
  [604800000, 'Last 7 days'],
];
const CHIPS = [
  ['Errors', 'error,fatal'],
  ['Warnings', 'warn'],
  ['Info', 'info'],
  ['Debug', 'debug,trace'],
];

export default function App() {
  const [range, setRange] = useState(3600000);
  const [app, setApp] = useState('');
  const [chips, setChips] = useState([]);
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(100);
  const [zoom, setZoom] = useState(null); // { from, to } in ms, set by clicking a chart bar
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);
  const [data, setData] = useState({ logs: [], stats: null, win: null, error: null });

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => { setQ(qInput.trim()); setLimit(100); }, 300);
    return () => clearTimeout(t);
  }, [qInput]);

  // live mode: re-run the fetch every 5 seconds
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [live]);

  // fetch whenever a filter changes
  useEffect(() => {
    let cancelled = false;
    const to = zoom ? zoom.to : Date.now();
    const from = zoom ? zoom.from : to - range;
    const base = {
      from: new Date(from).toISOString(),
      to: new Date(to + 1000).toISOString(),
      application: app,
      level: chips.join(','),
      q,
    };
    const bucketMinutes = Math.max(1, Math.ceil((to - from) / 48 / 60000));
    Promise.all([getLogs({ ...base, limit }), getStats({ ...base, bucketMinutes })])
      .then(([l, s]) => !cancelled && setData({ logs: l.logs, stats: s, win: { from, to }, error: null }))
      .catch((e) => !cancelled && setData((d) => ({ ...d, error: e.message })));
    return () => { cancelled = true; };
  }, [range, app, chips, q, limit, zoom, tick]);

  const toggleChip = (key) => {
    setChips((c) => (c.includes(key) ? c.filter((k) => k !== key) : [...c, key]));
    setLimit(100);
  };
  const toggleLive = () => { setZoom(null); setLive((v) => !v); };

  const { logs, stats, win, error } = data;
  const t = stats ? stats.totals : {};
  const total = Object.values(t).reduce((s, n) => s + n, 0);
  const errors = (t.error || 0) + (t.fatal || 0);

  return (
    <>
      <header>
        <h1>Log Dashboard</h1>
        <span className="sp" />
        <button className="live" aria-pressed={live} onClick={toggleLive}><i />Live</button>
      </header>

      <main>
        <div className="bar">
          <select aria-label="Time range" value={range} onChange={(e) => { setRange(+e.target.value); setZoom(null); setLimit(100); }}>
            {RANGES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <select aria-label="Application" value={app} onChange={(e) => { setApp(e.target.value); setLimit(100); }}>
            <option value="">All applications</option>
            {stats && stats.applications.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="chips">
            {CHIPS.map(([label, key]) => (
              <button key={key} className="chip" aria-pressed={chips.includes(key)} onClick={() => toggleChip(key)}>{label}</button>
            ))}
          </div>
          <input type="search" placeholder="Search messages" aria-label="Search messages" value={qInput} onChange={(e) => setQInput(e.target.value)} />
        </div>

        <p className="summary">
          <span><b>{total.toLocaleString()}</b>logs</span>
          <span className="e"><b>{errors.toLocaleString()}</b>errors</span>
          <span className="w"><b>{(t.warn || 0).toLocaleString()}</b>warnings</span>
        </p>

        {zoom && (
          <p className="rangeNote">
            Showing {clock(zoom.from, true)} to {clock(zoom.to, true)}.{' '}
            <button onClick={() => setZoom(null)}>Back to {RANGES.find(([v]) => v === range)[1].toLowerCase()}</button>
          </p>
        )}

        <Chart stats={stats} win={win} onZoom={(z) => { setZoom(z); setLimit(100); }} />

        <LogTable logs={logs} error={error} canLoadMore={logs.length >= limit && limit < 500} onMore={() => setLimit((l) => Math.min(l + 100, 500))} />

        <AskPanel />
      </main>
    </>
  );
}
