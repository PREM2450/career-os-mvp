"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function AccountSettings() {
  const { user } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = () => {
    if (newPassword.length === 0)
      return {
        text: "",
        color: "",
      };

    if (newPassword.length < 6)
      return {
        text: "Weak",
        color: "text-red-400",
      };

    if (
      newPassword.length < 10 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    )
      return {
        text: "Medium",
        color: "text-yellow-400",
      };

    return {
      text: "Strong",
      color: "text-green-400",
    };
  };

  const strength = getStrength();

  async function handleSave() {
    if (!currentPassword) {
      toast.error("Enter current password");
      return;
    }

    if (!newPassword) {
      toast.error("Enter new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="grid gap-6 md:grid-cols-2">

        {/* Name */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <User size={16} />
            Name
          </label>

          <input
            value={user?.name || ""}
            disabled
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Mail size={16} />
            Email
          </label>

          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />
        </div>

      </div>

      <div className="my-8 h-px bg-white/10" />

      <h3 className="mb-6 text-xl font-bold">
        Change Password
      </h3>

      <div className="space-y-5">

        {/* Current */}

        <PasswordInput
          label="Current Password"
          value={currentPassword}
          setValue={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
        />

        {/* New */}

        <PasswordInput
          label="New Password"
          value={newPassword}
          setValue={setNewPassword}
          show={showNew}
          setShow={setShowNew}
        />

        {strength.text && (
          <p className={`font-medium ${strength.color}`}>
            Password Strength: {strength.text}
          </p>
        )}

        {/* Confirm */}

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
        />

      </div>

      <button
        onClick={handleSave}
        className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold hover:scale-105 transition"
      >
        <Save size={18} />
        Save Changes
      </button>

    </div>
  );
}

function PasswordInput({
  label,
  value,
  setValue,
  show,
  setShow,
}: any) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <Lock size={16} />
        {label}
      </label>

      <div className="relative">

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 pr-12 outline-none focus:border-violet-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

      </div>
    </div>
  );
}