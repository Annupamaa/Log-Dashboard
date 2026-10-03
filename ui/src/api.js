const qs = (o) =>
  new URLSearchParams(Object.entries(o).filter(([, v]) => v !== '' && v != null));

async function get(url) {
  const r = await fetch(url);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
  return body;
}

export const getLogs = (params) => get('/logs?' + qs(params));
export const getStats = (params) => get('/logs/stats?' + qs(params));

export async function ask(question) {
  const r = await fetch('/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (r.status === 404) throw new Error('This feature is not switched on for this server yet.');
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
  return body;
}

export const clock = (ms, withDate) =>
  new Date(ms).toLocaleString(
    [],
    withDate
      ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
      : { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  );
