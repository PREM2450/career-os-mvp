"use client";

import { useEffect, useState } from "react";

export interface Mission {
  _id: string;
  title: string;
  category: string;
  xp: number;
  completed: boolean;
}

export default function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMissions() {
    try {
      let res = await fetch("/api/missions");
      let data = await res.json();

      // Agar missions nahi hain to generate karo
      if (data.success && data.missions.length === 0) {
        const generateRes = await fetch("/api/missions/generate", {
  method: "POST",
});

        const generated = await generateRes.json();

        if (generated.success) {
          setMissions(generated.missions);
          return;
        }
      }

      if (data.success) {
        setMissions(data.missions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    refresh: fetchMissions,
  };
}