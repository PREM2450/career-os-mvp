"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  RotateCcw,
  Trash2,
  AlertTriangle,
  LogOut,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AdvancedSettings() {
  const [loading, setLoading] = useState(false);

  async function exportData() {
    try {
      setLoading(true);

      const res = await fetch("/api/settings/export");

      if (!res.ok) throw new Error();

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "career-os-data.json";
      a.click();

      window.URL.revokeObjectURL(url);

      toast.success("Career data exported.");
    } catch {
      toast.error("Unable to export data.");
    } finally {
      setLoading(false);
    }
  }

  function downloadResume() {
    toast.info("Resume analysis download coming soon.");
  }

  function resetProgress() {
    toast.warning("Reset progress API not connected yet.");
  }

  function logoutDevices() {
    toast.info("Logout all devices feature coming soon.");
  }

  async function deleteAccount() {
  const confirmed = confirm(
    "This will permanently delete your account and all data. Continue?"
  );

  if (!confirmed) return;

  try {
    const res = await fetch("/api/settings/delete-account", {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success("Account deleted.");

    window.location.href = "/";
  } catch {
    toast.error("Something went wrong.");
  }
}
  return (
    <div className="space-y-6">

      {/* Utilities */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <h2 className="mb-6 text-xl font-bold">
          Utilities
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <ActionCard
            icon={<Download size={22} />}
            title="Export Career Data"
            description="Download all your Career OS data."
            button="Export"
            loading={loading}
            onClick={exportData}
          />

          <ActionCard
            icon={<FileText size={22} />}
            title="Resume Analysis"
            description="Download ATS & AI resume report."
            button="Download"
            onClick={downloadResume}
          />

          <ActionCard
            icon={<RotateCcw size={22} />}
            title="Reset Daily Progress"
            description="Reset today's missions and streak progress."
            button="Reset"
            onClick={resetProgress}
          />

          <ActionCard
            icon={<LogOut size={22} />}
            title="Logout All Devices"
            description="Sign out from every active session."
            button="Logout"
            onClick={logoutDevices}
          />

        </div>

      </div>

      {/* Danger Zone */}

      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">

        <div className="mb-6 flex items-center gap-3">

          <AlertTriangle
            size={28}
            className="text-red-400"
          />

          <div>

            <h2 className="text-2xl font-bold text-red-400">
              Danger Zone
            </h2>

            <p className="text-slate-400">
              Permanent account actions.
            </p>

          </div>

        </div>

        <div className="rounded-2xl border border-red-500/20 bg-black/20 p-6">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h3 className="text-lg font-semibold">
                Delete Account
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Permanently remove your account, missions,
                XP, achievements, roadmap and resume data.
              </p>

            </div>

            <button
              onClick={deleteAccount}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              <Trash2 size={18} />
              Delete Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  button,
  onClick,
  loading = false,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 p-6">

      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="font-semibold">
          {title}
        </h3>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        {description}
      </p>

      <button
        disabled={loading}
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 font-semibold transition hover:scale-105 disabled:opacity-50"
      >
        <Save size={16} />
        {button}
      </button>

    </div>
  );
}