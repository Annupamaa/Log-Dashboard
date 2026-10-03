import { useState } from 'react';
import { ask } from '../api';

export default function AskPanel() {
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState(null); // { text, steps, error }

  const submit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    setAnswer(null);
    try {
      const r = await ask(question.trim());
      setAnswer({ text: r.answer, steps: (r.steps || []).map((s) => s.tool.replace(/_/g, ' ')) });
    } catch (err) {
      setAnswer({ error: err.message });
    }
    setBusy(false);
  };

  return (
    <section className="panel" id="ask">
      <h2>Ask about your logs</h2>
      <p className="sub">Plain-English questions, answered from your log data.</p>
      <form onSubmit={submit}>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Which application had the most errors in the last hour?" aria-label="Question" />
        <button disabled={busy}>{busy ? 'Thinking' : 'Ask'}</button>
      </form>
      {answer && (
        <>
          <div id="answer" className={answer.error ? 'err' : ''}>{answer.error || answer.text}</div>
          {answer.steps && answer.steps.length > 0 && <div id="steps">Looked at: {answer.steps.join(', ')}</div>}
        </>
      )}
    </section>
  );
}
