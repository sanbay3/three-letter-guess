"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  evaluateGuess,
  getKeyboardStatuses,
  isWinningResult,
} from "@/lib/gameLogic";
import { pickRandomWord } from "@/lib/words";
import { createInitialStats, loadStats, recordResult, saveStats } from "@/lib/stats";
import Board from "./Board";
import Keyboard from "./Keyboard";
import StatsPanel from "./StatsPanel";

export default function Game() {
  // 正解の単語。useStateの初期化関数（遅延初期化）を使うことで、
  // 再レンダリングのたびにpickRandomWord()が呼ばれるのを防ぐ。
  const [answer, setAnswer] = useState(() => pickRandomWord());

  // 確定済みの挑戦履歴。 [{ word: "CAT", result: ["correct","absent","present"] }, ...]
  const [guesses, setGuesses] = useState([]);

  // 今まさに入力中の文字列（Enterを押すまでは判定されない）
  const [currentInput, setCurrentInput] = useState("");

  // "playing" | "won" | "lost"
  const [status, setStatus] = useState("playing");

  // 統計情報。このコンポーネントはssr:falseで読み込まれるため
  // サーバー側ではレンダリングされない = 初回レンダリングから
  // localStorageの値をそのまま使ってもサーバー/クライアントの
  // 表示が食い違う「hydrationエラー」は起こらない。
  // (このuseStateの初期化関数がここでの「遅延初期化」にあたる)
  const [stats, setStats] = useState(() => loadStats());

  // 1回分の入力を確定させる（Enterが押されたとき）
  const submitGuess = useCallback(() => {
    if (currentInput.length !== WORD_LENGTH) return;

    const result = evaluateGuess(currentInput, answer);
    const newGuess = { word: currentInput, result };
    const newGuesses = [...guesses, newGuess];

    setGuesses(newGuesses);
    setCurrentInput("");

    const won = isWinningResult(result);
    const lost = !won && newGuesses.length >= MAX_ATTEMPTS;

    if (won || lost) {
      setStatus(won ? "won" : "lost");
      const nextStats = recordResult(stats, won);
      setStats(nextStats);
      saveStats(nextStats);
    }
  }, [answer, currentInput, guesses, stats]);

  // 物理キーボード・画面キーボードの両方から呼ばれる共通のキー処理
  const handleKey = useCallback(
    (key) => {
      if (status !== "playing") return;

      if (key === "ENTER") {
        submitGuess();
        return;
      }

      if (key === "BACKSPACE") {
        setCurrentInput((prev) => prev.slice(0, -1));
        return;
      }

      // A-Z以外のキーは無視する
      if (!/^[A-Z]$/.test(key)) return;

      setCurrentInput((prev) => (prev.length < WORD_LENGTH ? prev + key : prev));
    },
    [status, submitGuess]
  );

  // 物理キーボードの入力を受け付ける
  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        handleKey("ENTER");
      } else if (key === "BACKSPACE") {
        handleKey("BACKSPACE");
      } else if (/^[A-Z]$/.test(key)) {
        handleKey(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  // もう一度遊ぶ（統計情報は引き継ぐ）
  function handleReset() {
    setAnswer(pickRandomWord());
    setGuesses([]);
    setCurrentInput("");
    setStatus("playing");
  }

  const keyStatuses = getKeyboardStatuses(guesses);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3文字あてゲーム</h1>

      <StatsPanel stats={stats} />

      <Board guesses={guesses} currentInput={currentInput} />

      {status !== "playing" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {status === "won" ? "🎉 正解！" : `不正解… 正解は「${answer}」でした`}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            もう一度遊ぶ
          </button>
        </div>
      )}

      <Keyboard onKey={handleKey} keyStatuses={keyStatuses} />
    </div>
  );
}
