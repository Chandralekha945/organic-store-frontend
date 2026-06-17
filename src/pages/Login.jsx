import { useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE || "https://organic-store-backend.up.railway.app/api";


export default function Login({ setUser, setPage }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", identifier: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const isEmail = (val) => /\S+@\S+\.\S+/.test(val);
  const isPhone = (val) => /^\d{10}$/.test(val.replace(/\D/g, ""));

  const validate = () => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = "Name is required";

    if (isRegister) {
      // Registration: require valid email AND valid phone separately
      if (!isEmail(form.identifier)) e.identifier = "Valid email required";
      if (!isPhone(form.phone)) e.phone = "Valid 10-digit phone number required";
    } else {
      // Login: identifier can be either email or phone
      if (!form.identifier.trim() || !(isEmail(form.identifier) || isPhone(form.identifier))) {
        e.identifier = "Enter a valid email or 10-digit phone number";
      }
    }

    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (isRegister && form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { name: form.name, email: form.identifier, phone: form.phone, password: form.password }
        : { identifier: form.identifier, password: form.password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      const data = await res.json();

// Save token
localStorage.setItem("token", data.token);

// Save user
localStorage.setItem("user", JSON.stringify(data.user));

// Update app state
setUser(data.user);

setSuccess(true);

// Redirect based on role
setTimeout(() => {
  if (data.user.role === "OWNER") {
    setPage("owner-dashboard");
  } else {
    setPage("home");
  }
}, 1200);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: "6rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 72, marginBottom: "1rem" }}>✅</div>
        <h2 style={{ color: "#1a4008", fontWeight: 800 }}>{isRegister ? "Account Created!" : "Welcome Back!"}</h2>
        <p style={{ color: "#6a9940" }}>Redirecting you…</p>
      </div>
    );
  }

  const inp = (field, label, type, placeholder) => (
    <div>
      <label style={{ fontWeight: 600, color: "#1a4008", fontSize: 14, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `2px solid ${errors[field] ? "#e74c3c" : "#d4edbc"}`, fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
      {errors[field] && <p style={{ color: "#e74c3c", fontSize: 12, margin: "4px 0 0" }}>{errors[field]}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 440, margin: "4rem auto", padding: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "2.5rem 2rem", border: "1px solid #e8f5dc", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 48 }}>🌿</div>
          <h1 style={{ color: "#1a4008", fontSize: 26, fontWeight: 900, margin: "0.5rem 0 0.25rem" }}>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "#6a9940", margin: 0, fontSize: 14 }}>
            {isRegister ? "Join our organic community" : "Sign in to continue"}
          </p>
        </div>

        {apiError && (
          <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", marginBottom: "1rem", color: "#e74c3c", fontSize: 14 }}>
            ⚠️ {apiError}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {isRegister && inp("name", "Full Name", "text", "Your name")}
          {isRegister
            ? inp("identifier", "Email", "email", "your@email.com")
            : inp("identifier", "Email or Phone Number", "text", "your@email.com or 9876543210")}
          {isRegister && inp("phone", "Phone Number", "tel", "10-digit phone number")}
          {inp("password", "Password", "password", "Min. 6 characters")}
          {isRegister && inp("confirm", "Confirm Password", "password", "Repeat password")}
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#6aab3a" : "#2d6a0e", color: "white", border: "none", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: "1.5rem", transition: "background 0.2s" }}>
          {loading ? "⏳ Please wait..." : isRegister ? "Create Account" : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: 14, color: "#888" }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => { setIsRegister(!isRegister); setErrors({}); setApiError(""); }} style={{ color: "#2d6a0e", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>

        {!isRegister && (
          <div style={{ background: "#f0f9e8", borderRadius: 10, padding: "12px", marginTop: "1rem", fontSize: 13, color: "#4a7c2a", textAlign: "center" }}>
            Demo: <strong>owner@organicstore.com</strong> / <strong>owner123</strong>
          </div>
        )}
      </div>
    </div>
  );
}