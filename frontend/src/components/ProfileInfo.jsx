"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

import { User, Settings, CircleHelp, LogOut } from "lucide-react";

export default function ProfileInfo() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/get-user");
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mt-8 w-full max-w-xl rounded-[32px] border border-gray-200 bg-white shadow-sm p-8">
        <button className="w-10 h-10 rounded-full bg-[#352C4D] hover:bg-[#4B3B6B] flex items-center justify-center text-white transition">
          <Image
            src={user?.profileImage || session.user.image || "/icons/user.png"}
            width={50}
            height={50}
            alt="Profile Image"
            className="rounded-full"
          />
        </button>

        {session && (
          <>
            <button
              className="flex items-center gap-5 text-slate-700 hover:text-red-500 transition"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            ></button>
          </>
        )}
      </div>
    </div>
  );
}
