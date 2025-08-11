import React, { useEffect, useState, useCallback } from "react";
import { ADMIN_TOKEN } from "../credentials";

const API_BASE = "https://student-working-server.onrender.com";

function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [clearing, setClearing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clearDb = async () => {
    if (!window.confirm("Точно очистить все записи? Это действие необратимо."))
      return;
    setClearing(true);
    try {
      const res = await fetch(`${API_BASE}/admin/clear`, {
        method: "POST",
        headers: {
          "X-Admin-Token": ADMIN_TOKEN,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ошибка очистки");
      // перезагружаем список
      await loadData();
      alert("База очищена");
    } catch (e) {
      alert(`Не удалось очистить базу: ${e.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-3 align-items-center">
        {/* ЛЕВО: заголовок + счётчик (только на мобиле) */}
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <h3 className="mb-1">Администрирование</h3>
          <span className="text-muted small d-inline d-md-none">
            Всего: {rows.length}
          </span>
        </div>

        {/* ПРАВО: кнопки + счётчик (на десктопе) */}
        <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-end gap-2">
          <button
            className="btn btn-outline-secondary btn-sm w-100 w-md-auto"
            onClick={loadData}
            disabled={loading}
          >
            Обновить
          </button>
          <button
            className="btn btn-outline-danger btn-sm w-100 w-md-auto"
            onClick={clearDb}
            disabled={clearing || loading}
          >
            {clearing ? "Очищаю…" : "Очистить базу"}
          </button>

          {/* счётчик справа только на md+ */}
          <span className="text-muted small d-none d-md-inline ms-md-2 text-nowrap">
            Всего: {rows.length}
          </span>
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
                <th>Дата</th>
                <th>Число</th>
                <th>Текст</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Нет данных
                  </td>
                </tr>
              ) : (
                rows
                  .sort((a, b) => a.id - b.id)
                  .map((r) => (
                    <tr key={r.id ?? `${r.date}-${r.number}-${r.text}`}>
                      <td>{r.id ?? "—"}</td>
                      <td>
                        {r.submitted_at
                          ? new Date(r.submitted_at).toLocaleString()
                          : "—"}
                      </td>
                      <td>
                        {r.submitted_at
                          ? new Date(r.submitted_at).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>
                      <td>{r.number}</td>
                      <td
                        style={{
                          maxWidth: 420,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {r.text}
                      </td>
                      <td>{r.ip || "—"}</td>
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
