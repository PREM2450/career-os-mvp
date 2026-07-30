import { useEffect, useState } from "react";

export interface ActivityDay {
  date: string;
  xp: number;
 missions: number;
  level: number;
}

export default function useActivity() {
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        const res = await fetch("/api/activity");

        const data = await res.json();

        if (data.success) {
          setActivity(data.activity);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, []);

  return {
    activity,
    loading,
  };
}