import React, { useEffect, useState, useCallback } from 'react';
import { ADMIN_TOKEN } from '../credentials';

const API_BASE = 'https://student-working-server.onrender.com';

function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [clearing, setClearing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const clearDb = async () => {
    if (!window.confirm('Точно очистить все записи? Это действие необратимо.')) return;
    setClearing(true);
    try {
      const res = await fetch(`${API_BASE}/admin/clear`, {
        method: 'POST',
        headers: {
          'X-Admin-Token': ADMIN_TOKEN,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Ошибка очистки');
      // перезагружаем список
      await loadData();
      alert('База очищена');
    } catch (e) {
      alert(`Не удалось очистить базу: ${e.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Администрирование</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadData} disabled={loading}>
            Обновить
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={clearDb} disabled={clearing || loading}>
            {clearing ? 'Очищаю…' : 'Очистить базу'}
          </button>
          <span className="text-muted small">Всего: {rows.length}</span>
        </div>
      </div>

      {loading && <div className="alert alert-info">Загрузка…</div>}
      {err && !loading && <div className="alert alert-danger">{err}</div>}

      {!loading && !err && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Дата отправки</th>
                <th>Дата (поле)</th>
                <th>Число</th>
                <th>Текст</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Нет данных</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id ?? `${r.date}-${r.number}-${r.text}`}>
                    <td>{r.id ?? '—'}</td>
                    <td>{r.submitted_at ? new Date(r.submitted_at).toLocaleString() : '—'}</td>
                    <td>{r.date}</td>
                    <td>{r.number}</td>
                    <td style={{maxWidth: 420, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{r.text}</td>
                    <td>{r.ip || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
