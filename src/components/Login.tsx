import { forwardRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const S = `
  .login-wrap {
    min-height: 100vh;
    background: #07090f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 20px;
  }
  .login-box {
    background: #0c1018;
    border: 1px solid #192030;
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
  }
  .login-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }
  .login-logo-mark {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15));
    border: 1px solid rgba(0,212,255,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .login-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #dde4ef;
  }
  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #dde4ef;
    margin-bottom: 6px;
  }
  .login-sub {
    font-size: 13px;
    color: #4e5f74;
    margin-bottom: 28px;
  }
  .login-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4e5f74;
    display: block;
    margin-bottom: 6px;
  }
  .login-input {
    width: 100%;
    background: #101520;
    border: 1px solid #1e2a3d;
    border-radius: 8px;
    padding: 10px 12px;
    color: #dde4ef;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    margin-bottom: 16px;
    transition: border-color 0.13s;
    box-sizing: border-box;
  }
  .login-input:focus {
    border-color: #00d4ff;
  }
  .login-btn {
    width: 100%;
    padding: 11px;
    background: #00d4ff;
    color: #000;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 4px;
  }
  .login-btn:hover { opacity: 0.85; }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .login-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 12px;
    color: #ef4444;
    margin-bottom: 16px;
  }
  .login-success {
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 12px;
    color: #10b981;
    margin-bottom: 16px;
  }
  .login-toggle {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #4e5f74;
  }
  .login-toggle span {
    color: #00d4ff;
    cursor: pointer;
    text-decoration: underline;
  }
  .login-divider {
    border: none;
    border-top: 1px solid #192030;
    margin: 24px 0;
  }
  .login-context {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00d4ff;
    margin-bottom: 4px;
  }
`;

const Login = forwardRef<HTMLDivElement, Record<string, never>>(function Login(_props, _ref) {
  const [mode, setMode]         = useState<"login" | "signup">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else {
        setSuccess("Account created. Check your email to confirm, or just log in if confirmation is disabled.");
        setMode("login");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <style>{S}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-logo">
            <div className="login-logo-mark">⬡</div>
            <span className="login-logo-text">PM Agent OS</span>
          </div>
          <div className="login-context">AI-Powered Workflow OS</div>
          <div className="login-title">
            {mode === "login" ? "Welcome back" : "Create account"}
          </div>
          <div className="login-sub">
            {mode === "login"
              ? "Sign in to your Sr. PM Command Centre"
              : "Set up your PM Agent OS account"}
          </div>

          {error   && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}

          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
          />

          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <hr className="login-divider"/>

          <div className="login-toggle">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <span onClick={() => { setMode("signup"); setError(""); }}>
                  Create one
                </span>
              </>
            ) : (
              <>Already have an account?{" "}
                <span onClick={() => { setMode("login"); setError(""); }}>
                  Sign in
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

Login.displayName = "Login";

export default Login;
