import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const formatSalary = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const FIELD_STYLE = {
  width: "100%",
  padding: "12px 16px",
  background: "#0f1117",
  border: "1px solid #2a2d3e",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  appearance: "none",
  WebkitAppearance: "none",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontFamily: "'Space Mono', monospace",
};

export default function App() {
  const [options, setOptions] = useState({ genders: [], education_levels: [], job_titles: [] });
  const [form, setForm] = useState({
    age: "", gender: "", education_level: "", job_title: "", years_of_experience: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/options`)
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => setError("⚠️ Could not connect to API. Make sure the backend is running."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => v === "")) {
      setError("Please fill in all fields before predicting.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(form.age),
          gender: form.gender,
          education_level: form.education_level,
          job_title: form.job_title,
          years_of_experience: parseFloat(form.years_of_experience),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "age", label: "Age", type: "number", placeholder: "e.g. 32", min: 18, max: 70 },
    { name: "years_of_experience", label: "Years of Experience", type: "number", placeholder: "e.g. 5", min: 0, max: 45 },
  ];

  const selects = [
    { name: "gender", label: "Gender", opts: options.genders },
    { name: "education_level", label: "Education Level", opts: options.education_levels },
    { name: "job_title", label: "Job Title", opts: options.job_titles },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070a12",
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(56,189,248,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.08) 0%, transparent 50%)
      `,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: "100px",
          padding: "6px 16px",
          marginBottom: "20px",
        }}>
          <span style={{ width: "7px", height: "7px", background: "#38bdf8", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #38bdf8" }} />
          <span style={{ fontSize: "12px", color: "#38bdf8", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
            ML MODEL · R² = 0.949
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(36px, 6vw, 58px)",
          fontWeight: "800",
          color: "#f1f5f9",
          margin: "0 0 12px 0",
          lineHeight: "1.05",
          letterSpacing: "-0.02em",
        }}>
          Salary<br />
          <span style={{
            background: "linear-gradient(135deg, #38bdf8, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Predictor</span>
        </h1>

        <p style={{ color: "#475569", fontSize: "15px", margin: 0, maxWidth: "380px" }}>
          GradientBoosting model trained on 2,000 records.
          Enter your profile to get an instant salary estimate.
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "rgba(15,17,23,0.85)",
        border: "1px solid #1e2130",
        borderRadius: "20px",
        padding: "36px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>

        {/* Number inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {fields.map((f) => (
            <div key={f.name}>
              <label style={LABEL_STYLE}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name]}
                min={f.min}
                max={f.max}
                onChange={handleChange}
                onFocus={() => setFocusField(f.name)}
                onBlur={() => setFocusField(null)}
                style={{
                  ...FIELD_STYLE,
                  borderColor: focusField === f.name ? "#38bdf8" : "#2a2d3e",
                }}
              />
            </div>
          ))}
        </div>

        {/* Select inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
          {selects.map((s) => (
            <div key={s.name}>
              <label style={LABEL_STYLE}>{s.label}</label>
              <div style={{ position: "relative" }}>
                <select
                  name={s.name}
                  value={form[s.name]}
                  onChange={handleChange}
                  onFocus={() => setFocusField(s.name)}
                  onBlur={() => setFocusField(null)}
                  style={{
                    ...FIELD_STYLE,
                    cursor: "pointer",
                    borderColor: focusField === s.name ? "#38bdf8" : "#2a2d3e",
                    color: form[s.name] ? "#e2e8f0" : "#475569",
                  }}
                >
                  <option value="">Select {s.label}...</option>
                  {s.opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <span style={{
                  position: "absolute", right: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#475569",
                  pointerEvents: "none", fontSize: "12px"
                }}>▼</span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#1e2130" : "linear-gradient(135deg, #38bdf8, #6366f1)",
            border: "none",
            borderRadius: "12px",
            color: loading ? "#475569" : "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.05em",
            transition: "opacity 0.2s, transform 0.1s",
            transform: loading ? "none" : "scale(1)",
          }}
          onMouseOver={e => { if (!loading) e.target.style.opacity = "0.88" }}
          onMouseOut={e => { e.target.style.opacity = "1" }}
        >
          {loading ? "⟳  Computing..." : "→  PREDICT SALARY"}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            color: "#f87171",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            marginTop: "24px",
            padding: "24px",
            background: "linear-gradient(135deg, rgba(56,189,248,0.07), rgba(99,102,241,0.07))",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "14px",
            animation: "fadeIn 0.4s ease",
          }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#64748b", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Estimated Annual Salary
            </p>

            <p style={{
              margin: "0 0 16px 0",
              fontSize: "42px",
              fontWeight: "800",
              fontFamily: "'Syne', sans-serif",
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}>
              {formatSalary(result.predicted_salary)}
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)",
                borderRadius: "10px", textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#475569", fontFamily: "'Space Mono',monospace", marginBottom: "4px" }}>LOW RANGE</p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#94a3b8" }}>
                  {formatSalary(result.salary_range_low)}
                </p>
              </div>
              <div style={{
                flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)",
                borderRadius: "10px", textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#475569", fontFamily: "'Space Mono',monospace", marginBottom: "4px" }}>HIGH RANGE</p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#94a3b8" }}>
                  {formatSalary(result.salary_range_high)}
                </p>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
              {result.message}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ marginTop: "32px", fontSize: "12px", color: "#1e2130", fontFamily: "'Space Mono', monospace" }}>
        ECE Engineering School · ML Deployment 2025-2026
      </p>
    </div>
  );
}
