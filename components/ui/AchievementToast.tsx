type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function AchievementToast({
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="w-[340px] rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-[#1b1f3b] to-[#0b1025] p-5 shadow-2xl backdrop-blur-xl">

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 text-4xl">
          {icon}
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Achievement Unlocked
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-300">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
}