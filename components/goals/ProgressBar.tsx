interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({
  completed,
  total,
}: ProgressBarProps) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mt-5">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300">Progress</span>
        <span className="font-semibold text-cyan-400">
          {percentage}%
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}