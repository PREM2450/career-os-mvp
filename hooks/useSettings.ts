"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings/preferences");

      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch {
      toast.error("Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(updated: any) {
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
        toast.success("Settings saved.");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Unable to save settings.");
    }
  }

  return {
    settings,
    loading,
    saveSettings,
    reload: loadSettings,
  };
}