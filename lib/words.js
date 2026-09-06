// 出題対象となる3文字英単語のリスト（すべて大文字で統一）
// EGG / BEE / ADD / ODD は同じ文字が2回登場する単語。
// gameLogic.js の色判定ロジック（重複文字の扱い）をテストしやすくするために
// あえて含めている。
export const WORD_LIST = [
  "CAT",
  "DOG",
  "SUN",
  "RUN",
  "BED",
  "CUP",
  "PEN",
  "BOX",
  "KEY",
  "RED",
  "TOP",
  "BAG",
  "CAR",
  "FAN",
  "JAM",
  "EGG",
  "BEE",
  "ADD",
  "ODD",
  "ZIP",
];

// 単語リストからランダムに1語を選んで返す
//
// なぜ Math.random() ではなく crypto.getRandomValues() を使うのか:
// プロジェクト共通ルールで「乱数は crypto.getRandomValues() に統一する」と
// 決めているため。Math.random() は疑似乱数で偏りが出ることがあるが、
// crypto.getRandomValues() はブラウザ標準の暗号強度の乱数生成APIで、
// より品質の高いランダム値が得られる。
export function pickRandomWord() {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomIndex = randomBuffer[0] % WORD_LIST.length;
  return WORD_LIST[randomIndex];
}
