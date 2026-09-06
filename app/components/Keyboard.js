"use client";

// 画面上に表示するキーボードの並び（QWERTY配列）
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const KEY_STATUS_STYLES = {
  correct: "bg-green-500 text-white",
  present: "bg-yellow-500 text-white",
  absent: "bg-zinc-400 text-white dark:bg-zinc-700",
  default: "bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-100",
};

/**
 * 画面上のキーボードUI。
 * 物理キーボードのkeydownイベントと同じ処理(onKey)を呼び出すことで、
 * 「タップでもキー入力でも同じロジックで判定できる」ようにしている。
 *
 * @param {(key: string) => void} onKey - キーが押されたときに呼ばれる。ENTER / BACKSPACE / A-Z のいずれかを受け取る
 * @param {Record<string, "correct"|"present"|"absent">} keyStatuses - 各文字キーの色分け情報
 */
export default function Keyboard({ onKey, keyStatuses }) {
  return (
    <div className="flex flex-col gap-1.5">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            const status = keyStatuses[key];
            const style = KEY_STATUS_STYLES[status] ?? KEY_STATUS_STYLES.default;
            const label = key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "ENTER" : key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className={`flex h-12 items-center justify-center rounded font-semibold uppercase transition-colors active:opacity-70 ${style} ${
                  isWide ? "min-w-[3.5rem] px-2 text-xs sm:text-sm" : "w-8 text-sm sm:w-10 sm:text-base"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
