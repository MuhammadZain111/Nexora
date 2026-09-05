import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, CircleHelp, LogOut, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileInfo() {
  const { user, isCheckingAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="px-3 py-3 border-t" style={{ borderColor: "#22293B" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: "#22293B" }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-20 rounded animate-pulse" style={{ background: "#22293B" }} />
            <div className="h-2 w-28 rounded animate-pulse" style={{ background: "#22293B" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-3 py-3 border-t" style={{ borderColor: "#22293B" }}>
        <p className="text-sm" style={{ color: "#8C97AE" }}>
          Signed out —{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium underline underline-offset-2"
            style={{ color: "#2EE6A8" }}
          >
            sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative px-3 py-3 border-t" style={{ borderColor: "#22293B" }}>
      {menuOpen && (
        <div
          className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border overflow-hidden"
          style={{ background: "#121826", borderColor: "#22293B" }}
        >
          <button
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors"
            style={{ color: "#ECEEF3" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1A2133")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Settings size={16} style={{ color: "#8C97AE" }} />
            Settings
          </button>
          <button
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors"
            style={{ color: "#ECEEF3" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1A2133")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <CircleHelp size={16} style={{ color: "#8C97AE" }} />
            Help
          </button>
          <div className="h-px" style={{ background: "#22293B" }} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors"
            style={{ color: "#FF7A59" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1A2133")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}

      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full flex items-center gap-3 rounded-xl px-2 py-2 transition-colors cursor-pointer"
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1A2133")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <img
          src="https://i.pravatar.cc/100"
          alt=""
          className="w-9 h-9 rounded-full border"
          style={{ borderColor: "#22293B" }}
        />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate" style={{ color: "#ECEEF3" }}>
            {user.name}
          </p>
          <p className="text-xs truncate" style={{ color: "#8C97AE" }}>
            {user.email}
          </p>
        </div>
        <ChevronUp
          size={16}
          style={{
            color: "#8C97AE",
            transform: menuOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>
    </div>
  );
}