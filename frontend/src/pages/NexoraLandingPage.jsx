import React, { useEffect, useState } from "react";
import { MessageCircle, Users, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";



const CONVERSATION = [
  { from: "them", text: "hey, are we still on for the sync?", delay: 600 },
  { from: "me", text: "yep, omw", delay: 1400 },
  { from: "them", text: "grabbing coffee, want anything?", delay: 2300 },
];

export default function NexoraLandingPage() 
{

  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timers = [];
    CONVERSATION.forEach((msg, i) => {
      // show a typing indicator just before each message lands
      timers.push(
        setTimeout(() => setTyping(true), msg.delay - 500)
      );
      timers.push(
        setTimeout(() => {
          setTyping(false);
          setVisibleCount((c) => Math.max(c, i + 1));
        }, msg.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#0B0F1A",
        color: "#ECEEF3",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');

        .font-display { font-family: 'Sora', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,230,168,0.45); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(46,230,168,0); }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bubble-in { animation: bubbleIn 0.35s ease-out both; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
        .type-dot { animation: typingBounce 1s infinite; }
        .type-dot:nth-child(2) { animation-delay: 0.15s; }
        .type-dot:nth-child(3) { animation-delay: 0.3s; }

        @media (prefers-reduced-motion: reduce) {
          .pulse-dot, .bubble-in, .type-dot { animation: none !important; }
        }
      `}</style>

      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 md:px-10 py-5 border-b"
        style={{ borderColor: "#22293B" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: "#2EE6A8" }}
          />
          <span className="font-display text-lg tracking-tight">Nexora</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider" style={{ color: "#8C97AE" }}>
          <a href="#features" className="hover:text-[#ECEEF3] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#ECEEF3] transition-colors">About</a>
        </div>

        <button
          className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-white/5"
          style={{ borderColor: "#22293B", color: "#ECEEF3" }}
        >
          Log in
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "#22293B", color: "#2EE6A8" }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#2EE6A8" }} />
            Live now
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] mb-6">
            Connect.
            <br />
            Chat.
            <br />
            Collaborate.
          </h1>

          <p className="text-base md:text-lg mb-9 max-w-md" style={{ color: "#8C97AE" }}>
            A simple and secure way to stay connected with the people that matter — messages arrive the instant you send them.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-xl transition-transform hover:scale-[1.03] cursor-pointer"
              style={{ background: "#FF7A59", color: "#1A0D07" }}
              onClick={() => navigate("/register")}
            >
              Get started
              <ArrowRight size={16} />
            </button>
            <button
              className="font-medium px-6 py-3 rounded-xl border transition-colors hover:bg-white/5 cursor-pointer  "
              style={{ borderColor: "#22293B", color: "#ECEEF3" }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Signature element — a chat window that types itself out */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "#121826", borderColor: "#22293B" }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: "#22293B" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-semibold"
              style={{ background: "#1B2333", color: "#2EE6A8" }}
            >
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Amara</p>
              <p className="font-mono text-[11px] flex items-center gap-1.5" style={{ color: "#2EE6A8" }}>
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#2EE6A8" }} />
                online
              </p>
            </div>
          </div>

          <div className="px-5 py-6 flex flex-col gap-3 min-h-[220px]">
            {CONVERSATION.slice(0, visibleCount).map((msg, i) => (
              <div
                key={i}
                className={`bubble-in max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === "me" ? "self-end" : "self-start"
                }`}
                style={{
                  background: msg.from === "me" ? "#FF7A59" : "#1B2333",
                  color: msg.from === "me" ? "#1A0D07" : "#ECEEF3",
                  borderBottomRightRadius: msg.from === "me" ? "4px" : undefined,
                  borderBottomLeftRadius: msg.from === "them" ? "4px" : undefined,
                }}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div
                className="self-start px-4 py-3 rounded-2xl flex items-center gap-1"
                style={{ background: "#1B2333", borderBottomLeftRadius: "4px" }}
              >
                <span className="type-dot w-1.5 h-1.5 rounded-full" style={{ background: "#8C97AE" }} />
                <span className="type-dot w-1.5 h-1.5 rounded-full" style={{ background: "#8C97AE" }} />
                <span className="type-dot w-1.5 h-1.5 rounded-full" style={{ background: "#8C97AE" }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-6 md:px-10 py-20 md:py-24 border-t"
        style={{ borderColor: "#22293B" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-14 text-center">
            Built for real conversations
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageCircle size={20} />}
              tag="REALTIME"
              title="Real-time"
              description="Messages land the moment they're sent — no refresh, no delay."
              accent="#2EE6A8"
            />
            <FeatureCard
              icon={<Users size={20} />}
              tag="GROUPS"
              title="Groups"
              description="Bring your whole team into one thread and stay in sync."
              accent="#7F9CF5"
            />
            <FeatureCard
              icon={<Lock size={20} />}
              tag="SECURE"
              title="Secure"
              description="Every session is authenticated end to end, by default."
              accent="#FF7A59"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 md:px-10 py-8 border-t font-mono text-xs flex items-center justify-between"
        style={{ borderColor: "#22293B", color: "#8C97AE" }}
      >
        <span>© {new Date().getFullYear()} Nexora</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#2EE6A8" }} />
          all systems online
        </span>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, tag, title, description, accent }) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "#121826", borderColor: "#22293B" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
        style={{ background: "#1B2333", color: accent }}
      >
        {icon}
      </div>
      <p className="font-mono text-[11px] tracking-wider mb-2" style={{ color: accent }}>
        {tag}
      </p>
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#8C97AE" }}>
        {description}
      </p>
    </div>
  );
}