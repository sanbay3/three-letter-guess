"use client";

import { MAX_ATTEMPTS, WORD_LENGTH } from "@/lib/gameLogic";

// 判定結果ごとのマスの色
// 未確定（まだ判定されていない）マスは status が無いのでdefaultを使う
const STATUS_STYLES = {
  correct: "bg-green-500 border-green-500 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-zinc-400 border-zinc-400 text-white dark:bg-zinc-700 dark:border-zinc-700",
  default:
    "bg-white border-zinc-300 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-600 dark:text-zinc-100",
};

// 1文字分のマス
function Cell({ letter, status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.default;

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded border-2 text-2xl font-bold uppercase sm:h-16 sm:w-16 ${style}`}
    >
      {letter}
    </div>
  );
}

/**
 * ゲーム盤全体。
 * MAX_ATTEMPTS行 × WORD_LENGTH列のマス目を表示する。
 *
 * - guesses: すでに確定した挑戦（判定色つき）
 * - currentInput: 今まさに入力中の文字列（まだ判定されていない）
 * - 残りの行は空欄として表示する
 */
export default function Board({ guesses, currentInput }) {
  const rows = [];

  for (let rowIndex = 0; rowIndex < MAX_ATTEMPTS; rowIndex++) {
    const confirmedGuess = guesses[rowIndex];
    const isCurrentRow = rowIndex === guesses.length;

    const letters = confirmedGuess
      ? confirmedGuess.word.split("")
      : isCurrentRow
        ? currentInput.split("")
        : [];

    const cells = [];
    for (let colIndex = 0; colIndex < WORD_LENGTH; colIndex++) {
      const letter = letters[colIndex] ?? "";
      const status = confirmedGuess ? confirmedGuess.result[colIndex] : undefined;
      cells.push(<Cell key={colIndex} letter={letter} status={status} />);
    }

    rows.push(
      <div key={rowIndex} className="flex gap-2">
        {cells}
      </div>
    );
  }

  return <div className="flex flex-col gap-2">{rows}</div>;
}
