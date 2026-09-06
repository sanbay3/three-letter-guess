"use client";

// 統計情報（プレイ回数・勝率・連続正解数）の表示パネル
export default function StatsPanel({ stats }) {
  const winRate =
    stats.playCount === 0 ? 0 : Math.round((stats.winCount / stats.playCount) * 100);

  const items = [
    { label: "プレイ回数", value: stats.playCount },
    { label: "勝率", value: `${winRate}%` },
    { label: "連続正解", value: stats.currentStreak },
    { label: "最高連続正解", value: stats.maxStreak },
  ];

  return (
    <div className="grid w-full max-w-sm grid-cols-4 gap-2 text-center">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded border border-zinc-200 bg-white px-1 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{item.value}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 sm:text-xs">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
