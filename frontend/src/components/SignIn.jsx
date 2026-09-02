import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  axiosInstance  from "@/lib/axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

/**
 * Sign in page — restyled to match Nexora's landing page tokens.
 *
 *  ink      #0B0F1A   page background
 *  surface  #121826   card background
 *  border   #22293B   hairlines / input borders
 *  text-hi  #ECEEF3   primary text
 *  text-mid #8C97AE   secondary text / placeholders
 *  signal   #2EE6A8   focus / accent (presence green)
 *  ember    #FF7A59   primary CTA
 */

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email: form.identifier,
        password: form.password,
      });

      dispatch(setUser(res.data));
      navigate("/chatui");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: "#0B0F1A", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500&display=swap');
        .font-display { font-family: 'Sora', system-ui, sans-serif; }
      `}</style>

      <div
        className="w-full max-w-[440px] rounded-2xl p-8 md:p-10 border"
        style={{ background: "#121826", borderColor: "#22293B" }}
      >
        <h2
          className="font-display text-2xl md:text-3xl font-semibold text-center mb-10"
          style={{ color: "#ECEEF3" }}
        >
          Sign in
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email / Username */}
          <div>
            <label
              className="block font-medium mb-2 text-sm"
              style={{ color: "#ECEEF3" }}
            >
              Email or username
            </label>

            <div className="relative">
              <input
                type="text"
                name="identifier"
                placeholder="you@example.com"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                className="w-full rounded-xl py-3.5 pl-4 pr-12 outline-none transition-colors"
                style={{
                  background: "#0B0F1A",
                  border: "1px solid #22293B",
                  color: "#ECEEF3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2EE6A8")}
                onBlur={(e) => (e.target.style.borderColor = "#22293B")}
                required
              />
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "#8C97AE" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block font-medium mb-2 text-sm"
              style={{ color: "#ECEEF3" }}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-xl py-3.5 pl-4 pr-12 outline-none transition-colors"
                style={{
                  background: "#0B0F1A",
                  border: "1px solid #22293B",
                  color: "#ECEEF3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2EE6A8")}
                onBlur={(e) => (e.target.style.borderColor = "#22293B")}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: "#8C97AE" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs mt-2" style={{ color: "#8C97AE" }}>
              Must be at least 6 characters.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm font-medium" style={{ color: "#FF7A59" }}>
              {error}
            </p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-base font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "#FF7A59", color: "#1A0D07" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Forgot Password */}
          <Link
            to="/forgot-password"
            className="text-center text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#8C97AE" }}
          >
            Forgot password?
          </Link>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px" style={{ background: "#22293B" }} />
          <span className="text-sm" style={{ color: "#8C97AE" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "#22293B" }} />
        </div>

        {/* Footer */}
        <p className="text-center text-sm" style={{ color: "#8C97AE" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: "#2EE6A8" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}