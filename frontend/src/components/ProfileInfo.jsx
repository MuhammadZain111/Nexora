import { useNavigate } from "react-router-dom";
import { Settings, CircleHelp, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileInfo() {
  const { user, isCheckingAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isCheckingAuth) return <p>Loading...</p>;
  if (!user) return <p>Failed to load user. Please log in.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mt-8 w-full max-w-xl rounded-[32px] border border-gray-200 bg-white shadow-sm p-8">
        {/* User info */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-slate-800 font-semibold">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 text-slate-700 hover:text-[#352C4D] transition cursor-pointer">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button className="flex items-center gap-3 text-slate-700 hover:text-[#352C4D] transition cursor-pointer">
            <CircleHelp size={18} />
            <span>Help</span>
          </button>

          <button
            className="flex items-center gap-3 text-slate-700 hover:text-red-500 transition cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}