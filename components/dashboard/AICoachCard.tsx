"use client";

interface Props {
  coach: {
    greeting: string;
    summary: string;
    focus: string[];
    motivation: string;
  };
}

export default function AICoachCard({
  coach,
}: Props) {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 p-8 text-white shadow-2xl">

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-4xl">
          🤖
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            AI Career Coach
          </h2>

          <p className="text-white/80">
            Personalized guidance for today
          </p>

        </div>

      </div>

      <div className="mt-8">

        <h3 className="text-2xl font-bold">
          {coach.greeting}
        </h3>

        <p className="mt-3 text-lg leading-8 text-white/90">
          {coach.summary}
        </p>

      </div>

      <div className="mt-8">

        <h3 className="mb-4 text-xl font-semibold">
          🎯 Today's Focus
        </h3>

        <ul className="space-y-3">

          {coach.focus.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-xl bg-white/10 p-3"
            >
              ✅ {item}
            </li>
          ))}

        </ul>

      </div>

      <div className="mt-8 rounded-2xl bg-white/10 p-5">

        <h3 className="mb-2 text-xl font-bold">
          💡 Motivation
        </h3>

        <p className="italic">
          "{coach.motivation}"
        </p>

      </div>

    </div>
  );
}