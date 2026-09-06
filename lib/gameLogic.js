// ゲームの基本ルールに関する定数
export const WORD_LENGTH = 3; // 単語の文字数
export const MAX_ATTEMPTS = 6; // 挑戦できる回数

// 1文字ごとの判定結果を表す文字列
// "correct" = 緑（位置も文字も正解）
// "present" = 黄（文字は含まれるが位置が違う）
// "absent"  = 灰（そもそも単語に含まれない）
export const LETTER_STATUS = {
  CORRECT: "correct",
  PRESENT: "present",
  ABSENT: "absent",
};

// 判定の優先度（オンスクリーンキーボードの色を決めるときに使う）
// 一度でも "correct" になった文字は、他の回で "absent" 判定が出ても
// 緑のままにしたいので、correct > present > absent の順で強い判定を残す
const STATUS_PRIORITY = {
  [LETTER_STATUS.ABSENT]: 0,
  [LETTER_STATUS.PRESENT]: 1,
  [LETTER_STATUS.CORRECT]: 2,
};

/**
 * 入力した単語(guess)を正解(answer)と比較して、1文字ずつの判定結果を返す。
 *
 * 【なぜ2段階に分けて判定するのか】
 * 同じ文字が複数含まれる単語（例: 正解が "EGG"）で、判定を1文字ずつ
 * その場で決めてしまうと重複判定のバグが起きる。
 *
 * 例) 正解が "EGG"、入力が "GEE" の場合
 *   もし1文字目から順番に「answerに含まれるかどうか」だけを見ていくと、
 *   answerには E が1つしかないのに、入力側の2つの E をどちらも
 *   「含まれている(黄)」と判定してしまい、Eが2個あるかのように
 *   誤って表示されてしまう。
 *
 * これを防ぐために、以下の2段階で処理する。
 *
 * 【1段階目: 緑（correct）を先に確定させる】
 * 位置まで完全に一致している文字を先にすべて確定させ、
 * 正解側の「使用済み」にする（answerLettersの該当位置をnullにする）。
 * これにより、後の黄色判定で「すでに緑で使われた文字」を
 * 二重にカウントしてしまうことを防げる。
 *
 * 【2段階目: 残った文字だけを対象に黄色（present）を判定する】
 * 緑で確定しなかった文字について、1段階目で消費されずに残っている
 * 正解側の文字（answerLetters）の中に同じ文字がないか探す。
 * 見つかったら黄色と判定し、その文字も「使用済み」として
 * answerLettersから取り除く（消費する）。こうすることで、
 * 正解に1個しかない文字を、入力側で2個以上「含まれている」と
 * 誤判定することがなくなる。
 *
 * @param {string} guess - プレイヤーが入力した3文字の単語（大文字）
 * @param {string} answer - 正解の単語（大文字）
 * @returns {("correct"|"present"|"absent")[]} 各文字位置に対応する判定結果
 */
export function evaluateGuess(guess, answer) {
  const guessLetters = guess.split("");
  // answerLetters は「まだ判定に使っていない正解の文字」を管理するための
  // 作業用コピー。緑・黄で使った文字はここから null にして消費していく。
  const answerLetters = answer.split("");
  const result = new Array(WORD_LENGTH).fill(LETTER_STATUS.ABSENT);

  // --- 1段階目: 緑(correct)の確定 ---
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = LETTER_STATUS.CORRECT;
      answerLetters[i] = null; // この文字は消費済みにする
    }
  }

  // --- 2段階目: 残った文字から黄(present)を判定 ---
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === LETTER_STATUS.CORRECT) continue; // 緑は対象外

    const foundIndex = answerLetters.indexOf(guessLetters[i]);
    if (foundIndex !== -1) {
      result[i] = LETTER_STATUS.PRESENT;
      answerLetters[foundIndex] = null; // この文字も消費済みにする
    }
    // 見つからなければ ABSENT のまま（初期値）
  }

  return result;
}

// すべての文字が緑（correct）なら正解
export function isWinningResult(result) {
  return result.every((status) => status === LETTER_STATUS.CORRECT);
}

/**
 * これまでの全ての挑戦結果から、オンスクリーンキーボードの
 * 各キー（文字）に表示すべき色を計算する。
 * 同じ文字を複数回使っていた場合は、一番強い判定（correct > present > absent）
 * を優先して残す。
 *
 * @param {{ word: string, result: string[] }[]} guesses
 * @returns {Record<string, "correct"|"present"|"absent">}
 */
export function getKeyboardStatuses(guesses) {
  const statuses = {};

  for (const guess of guesses) {
    for (let i = 0; i < guess.word.length; i++) {
      const letter = guess.word[i];
      const status = guess.result[i];
      const current = statuses[letter];

      if (!current || STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        statuses[letter] = status;
      }
    }
  }

  return statuses;
}
