import React, { useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { CREDENTIALS } from "../credentials"; // <- импорт

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const { username, password } = form;

    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      // можно хранить красивое имя отдельно, если нужно
      login(username);
      navigate("/admin", { replace: true });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card shadow" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body">
          <h4 className="card-title mb-4 text-center">Вход</h4>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Логин</label>
              <input
                className="form-control"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Войти
            </button>
          </form>
          {error && (
            <div className="alert alert-danger mt-3 mb-0 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
