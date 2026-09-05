import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import  axiosInstance  from "@/lib/axios";
import { setUser } from "@/store/authSlice";
import ValidationItem from "./ValidationItem";


export default function SignUp() {


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", form: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validations = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    numberOrSpecial: /[0-9!@#$%^&*]/.test(form.password),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = { email: "", form: "" };

    if (!form.fullName.trim()) {
      newErrors.form = "Please enter your name.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email.";
    } else if (!isPasswordValid) {
      newErrors.form = "Password doesn't meet the requirements below.";
    }

    if (newErrors.email || newErrors.form) {
      setErrors(newErrors);
      return;
    }

    setErrors({ email: "", form: "" });
    setLoading(true);

   try {
  setLoading(true);
   console.log("Base URL:", axiosInstance.defaults.baseURL);
    console.log("Signup endpoint:", "/api/auth/signup");

  const res = await axiosInstance.post("/api/auth/signup", form);

  // Signup successful
  dispatch(setUser(res.data));

  navigate("/login");

} catch (err) {
  console.error("Signup error:", err);

  if (err.response) {
    const status = err.response.status;
    const message =
      err.response.data?.message ||
      "Unable to create your account.";

    if (status === 400) {
      setErrors({
        email: err.response.data?.field === "email" ? message : "",
        form: err.response.data?.field === "email" ? "" : message,
      });

    } else if (status === 409) {
      setErrors({
        email: message,
        form: "",
      });

    } else if (status >= 500) {
      setErrors({
        email: "",
        form: "Server error. Please try again later.",
      });

    } else {
      setErrors({
        email: "",
        form: message,
      });
    }

  } else if (err.request) {
    setErrors({
      email: "",
      form: "Unable to connect to the server. Please check your connection.",
    });

  } else {
    setErrors({
      email: "",
      form: "Something went wrong. Please try again.",
    });
  }

} finally {
  setLoading(false);
}

  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#0B0F1A", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500&display=swap');
        .font-display { font-family: 'Sora', system-ui, sans-serif; }
      `}</style>

      <div
        className="w-full max-w-[460px] rounded-2xl p-8 md:p-10 border"
        style={{ background: "#121826", borderColor: "#22293B" }}
      >
        <h2
          className="font-display text-2xl md:text-3xl font-semibold text-center mb-8"
          style={{ color: "#ECEEF3" }}
        >
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full name */}
          <div>
            <label className="block font-medium mb-2 text-sm" style={{ color: "#ECEEF3" }}>
              Full name
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                autoComplete="name"
                className="w-full rounded-xl py-3.5 pl-4 pr-12 outline-none transition-colors"
                style={{ background: "#0B0F1A", border: "1px solid #22293B", color: "#ECEEF3" }}
                onFocus={(e) => (e.target.style.borderColor = "#2EE6A8")}
                onBlur={(e) => (e.target.style.borderColor = "#22293B")}
                required
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#8C97AE" }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2 text-sm" style={{ color: "#ECEEF3" }}>
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                className="w-full rounded-xl py-3.5 pl-4 pr-12 outline-none transition-colors"
                style={{ background: "#0B0F1A", border: "1px solid #22293B", color: "#ECEEF3" }}
                onFocus={(e) => (e.target.style.borderColor = "#2EE6A8")}
                onBlur={(e) => (e.target.style.borderColor = "#22293B")}
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#8C97AE" }} />
            </div>
            {errors.email && (
              <p className="text-sm mt-2" style={{ color: "#FF7A59" }}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-2 text-sm" style={{ color: "#ECEEF3" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
                className="w-full rounded-xl py-3.5 pl-4 pr-12 outline-none transition-colors"
                style={{ background: "#0B0F1A", border: "1px solid #22293B", color: "#ECEEF3" }}
                onFocus={(e) => (e.target.style.borderColor = "#2EE6A8")}
                onBlur={(e) => (e.target.style.borderColor = "#22293B")}
                required
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
          </div>

          {/* Password checklist */}
          <div className="rounded-xl p-4" style={{ background: "#0B0F1A", border: "1px solid #22293B" }}>
            <p className="text-sm font-medium mb-3" style={{ color: "#ECEEF3" }}>
              Password must contain
            </p>
            <div className="flex flex-col gap-1.5">
              <ValidationItem valid={validations.length} text="At least 8 characters" />
              <ValidationItem valid={validations.uppercase} text="One uppercase letter" />
              <ValidationItem valid={validations.lowercase} text="One lowercase letter" />
              <ValidationItem valid={validations.numberOrSpecial} text="One number or special character" />
            </div>
          </div>

          {errors.form && (
            <p className="text-sm font-medium" style={{ color: "#FF7A59" }}>{errors.form}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-base font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "#FF7A59", color: "#1A0D07" }}
          >
            {loading ? "Signing up…" : "Sign up"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm" style={{ color: "#8C97AE" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "#2EE6A8" }}>
              Log in
            </Link>
          </p>

          <p className="text-center text-sm">
            <Link to="/" className="font-semibold" style={{ color: "#2EE6A8" }}>
              Return to home page
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}