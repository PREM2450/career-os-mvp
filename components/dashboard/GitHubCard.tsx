"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  GitBranch,
  BookOpen,
  Users,
  ExternalLink,
} from "lucide-react";

interface GitHubProfile {
  username: string;
  name: string;
  avatar: string;
  publicRepos: number;
  followers: number;
  profileUrl: string;
}

export default function GitHubCard() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    loadGitHub();
  }, []);

  async function loadGitHub() {
    try {
      const res = await fetch("/api/github", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setProfile(data.profile);
      }
    } catch {}
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <GitBranch className="mb-4 text-white" size={28} />

        <h3 className="font-semibold">
          GitHub
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Connect your GitHub account
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-4">

        <Image
          src={profile.avatar}
          alt={profile.username}
          width={55}
          height={55}
          className="rounded-full"
        />

        <div>
          <h3 className="font-semibold">
            {profile.name || profile.username}
          </h3>

          <p className="text-sm text-slate-400">
            @{profile.username}
          </p>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-900/50 p-4">

          <BookOpen
            className="mb-2 text-cyan-400"
            size={18}
          />

          <div className="text-2xl font-bold">
            {profile.publicRepos}
          </div>

          <div className="text-xs text-slate-400">
            Repositories
          </div>

        </div>

        <div className="rounded-xl bg-slate-900/50 p-4">

          <Users
            className="mb-2 text-green-400"
            size={18}
          />

          <div className="text-2xl font-bold">
            {profile.followers}
          </div>

          <div className="text-xs text-slate-400">
            Followers
          </div>

        </div>

      </div>

      <a
        href={profile.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 font-medium transition hover:scale-[1.02]"
      >
        <ExternalLink size={16} />
        View Profile
      </a>

    </div>
  );
}