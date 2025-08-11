import React, { useState } from "react";

function Home() {
  const [date, setDate] = useState("");
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        "https://student-working-server.onrender.com/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, number, text }),
        }
      );
      const data = await res.json();
      setMessage(res.ok ? data.message : data.error);
    } catch {
      setMessage("Ошибка при отправке");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card shadow" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body">
          <h4 className="card-title mb-4 text-center">Форма ввода</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Дата:</label>
              <input
                className="form-control"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Число:</label>
              <input
                className="form-control"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/, ""))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Текст:</label>
              <textarea
                className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </form>
          {message && (
            <div
              className="alert alert-info mt-4 mb-0 text-center"
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
