import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./auth";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ResourceEdit from "./pages/ResourceEdit";
import ResourceList from "./pages/ResourceList";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { resources } from "./resources";

const CRUD = Object.keys(resources);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            {CRUD.map((key) => (
              <Route key={key} path={key} element={<ResourceList resourceKey={key} />} />
            ))}
            {CRUD.map((key) => (
              <Route key={`${key}-edit`} path={`${key}/:id`} element={<ResourceEdit resourceKey={key} />} />
            ))}
            <Route path="leads" element={<Leads />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
