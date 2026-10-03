import { Fragment, useState } from 'react';
import { clock } from '../api';

export default function LogTable({ logs, error, canLoadMore, onMore }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (k) =>
    setOpen((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <>
      <div className="panel">
        <table>
          <thead>
            <tr><th>Time</th><th>Level</th><th>Application</th><th>Message</th></tr>
          </thead>
          <tbody>
            {logs.map((l, i) => {
              const key = `${l.timestamp}-${i}`;
              const level = (l.log && l.log.level) || 'info';
              const ts = new Date(l.timestamp).getTime();
              return (
                <Fragment key={key}>
                  <tr className="row" onClick={() => toggle(key)}>
                    <td className="t">{isNaN(ts) ? String(l.timestamp) : clock(ts, true)}</td>
                    <td><span className={`lv ${level}`}>{level}</span></td>
                    <td className="a">{l.application}</td>
                    <td className="m">{l.message}</td>
                  </tr>
                  {open.has(key) && (
                    <tr className="detail"><td colSpan={4}><pre>{JSON.stringify(l, null, 2)}</pre></td></tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {error ? (
          <div className="empty err">Could not load logs: {error}</div>
        ) : logs.length === 0 ? (
          <div className="empty">No logs match these filters in this time range.</div>
        ) : null}
      </div>
      {canLoadMore && <button className="more" onClick={onMore}>Load more</button>}
    </>
  );
}
