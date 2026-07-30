"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface Props {
  xp: number;
  level: number;
}

export default function GoalProgressRing({
  xp,
  level,
}: Props) {

  const xpNeeded = level * 200;

  const progress = Math.min(
    (xp / xpNeeded) * 100,
    100
  );

  const data = [
    {
      value: progress,
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="mb-8 text-xl font-bold">
        Level Progress
      </h2>

      <div className="flex justify-center">

        <RadialBarChart
          width={260}
          height={260}
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={18}
          data={data}
          startAngle={90}
          endAngle={-270}
        >

          <PolarAngleAxis
            type="number"
            domain={[0,100]}
            angleAxisId={0}
            tick={false}
          />

          <RadialBar
            background
            dataKey="value"
            cornerRadius={20}
          />

          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            className="fill-white text-3xl font-bold"
          >
            {Math.round(progress)}%
          </text>

          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            className="fill-cyan-400 text-lg"
          >
            Level {level}
          </text>

        </RadialBarChart>

      </div>

      <div className="mt-6 text-center text-gray-400">

        {xp} / {xpNeeded} XP

      </div>

    </div>
  );
}