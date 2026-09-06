// localStorageに保存する統計情報のキー名（要件で指定されたもの）
export const STATS_STORAGE_KEY = "three-letter-guess:stats";

// 統計情報の初期値
export function createInitialStats() {
  return {
    playCount: 0, // プレイ回数
    winCount: 0, // 勝った回数
    currentStreak: 0, // 現在の連続正解数
    maxStreak: 0, // 過去最高の連続正解数
  };
}

/**
 * localStorageから統計情報を読み込む。
 * 保存データが無い場合や壊れている場合は初期値を返す。
 *
 * try/catchで囲っているのは、プライベートブラウジングモードなどで
 * localStorageへのアクセス自体が例外を投げる環境があるため。
 * 統計情報が読み込めないだけでゲーム自体は遊べるようにしたいので、
 * ここでエラーを握りつぶして初期値にフォールバックする。
 */
export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return createInitialStats();

    const parsed = JSON.parse(raw);
    return { ...createInitialStats(), ...parsed };
  } catch {
    return createInitialStats();
  }
}

// 統計情報をlocalStorageに保存する
export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // 保存できなくてもゲームの進行には影響させない
  }
}

/**
 * 1ゲーム終了時に統計情報を更新した新しいオブジェクトを返す。
 * (元のstatsオブジェクトは書き換えず、新しいオブジェクトを作って返す)
 *
 * @param {ReturnType<typeof createInitialStats>} stats
 * @param {boolean} won - そのゲームに勝ったかどうか
 */
export function recordResult(stats, won) {
  const nextStreak = won ? stats.currentStreak + 1 : 0;

  return {
    playCount: stats.playCount + 1,
    winCount: stats.winCount + (won ? 1 : 0),
    currentStreak: nextStreak,
    maxStreak: Math.max(stats.maxStreak, nextStreak),
  };
}
