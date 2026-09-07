import { useEffect, useState } from "react";
import { del, get, post, put } from "../api";
import { RequireAdmin, useAuth } from "../auth";

const emptyForm = {
  email: "",
  name: "",
  password: "",
  role: "editor",
  active: true,
};

export default function Users() {
  return (
    <RequireAdmin>
      <UsersInner />
    </RequireAdmin>
  );
}

function UsersInner() {
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({});

  async function load() {
    setError("");
    try {
      const res = await get("/api/admin/users");
      setItems(res.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await post("/api/admin/users", form);
      setForm(emptyForm);
      setMessage("User created");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onSaveEdit(id) {
    setError("");
    setMessage("");
    try {
      const payload = {
        name: edit.name,
        role: edit.role,
        active: edit.active,
      };
      if (edit.password) payload.password = edit.password;
      await put(`/api/admin/users/${id}`, payload);
      setEditingId(null);
      setMessage("User updated");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id, email) {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await del(`/api/admin/users/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Users</h1>
        <p className="muted">Admin accounts (admin role only).</p>
      </header>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert ok">{message}</div>}

      <section className="panel">
        <h2>Create user</h2>
        <form className="form-grid" onSubmit={onCreate}>
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>
          <label>
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <div className="form-actions span-2">
            <button type="submit" className="btn primary">
              Create
            </button>
          </div>
        </form>
      </section>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Active</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>
                  {editingId === u.id ? (
                    <input
                      value={edit.name}
                      onChange={(e) => setEdit((x) => ({ ...x, name: e.target.value }))}
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td>
                  {editingId === u.id ? (
                    <select value={edit.role} onChange={(e) => setEdit((x) => ({ ...x, role: e.target.value }))}>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td>
                  {editingId === u.id ? (
                    <input
                      type="checkbox"
                      checked={!!edit.active}
                      onChange={(e) => setEdit((x) => ({ ...x, active: e.target.checked }))}
                    />
                  ) : (
                    <span className={`badge ${u.active ? "ok" : ""}`}>{u.active ? "Yes" : "No"}</span>
                  )}
                </td>
                <td className="row-actions">
                  {editingId === u.id ? (
                    <>
                      <input
                        type="password"
                        placeholder="New password (optional)"
                        value={edit.password || ""}
                        onChange={(e) => setEdit((x) => ({ ...x, password: e.target.value }))}
                      />
                      <button type="button" className="link" onClick={() => onSaveEdit(u.id)}>
                        Save
                      </button>
                      <button type="button" className="link" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="link"
                        onClick={() => {
                          setEditingId(u.id);
                          setEdit({ name: u.name, role: u.role, active: u.active, password: "" });
                        }}
                      >
                        Edit
                      </button>
                      {u.id !== me?.id && (
                        <button type="button" className="link danger" onClick={() => onDelete(u.id, u.email)}>
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
