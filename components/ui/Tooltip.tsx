"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

export default function CustomTooltip({
  children,
  date,
  xp,
  missions,
}: {
  children: React.ReactNode;
  date: string;
  xp: number;
  missions: number;
}) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>

        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>

        <Tooltip.Portal>

          <Tooltip.Content
            side="top"
            className="rounded-xl border border-white/10 bg-slate-900/95 p-3 text-sm shadow-2xl backdrop-blur-xl"
          >

            <p className="font-semibold text-cyan-400">
              {date}
            </p>

            <p className="mt-2 text-white">
              ⚡ XP : {xp}
            </p>

            <p className="text-white">
              ✅ Missions : {missions}
            </p>

            <Tooltip.Arrow className="fill-slate-900" />

          </Tooltip.Content>

        </Tooltip.Portal>

      </Tooltip.Root>
    </Tooltip.Provider>
  );
}