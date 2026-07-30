"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);

  async function refreshUser() {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return {
    user,
    refreshUser,
  };
}