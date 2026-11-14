# 3文字あてゲーム

## 概要

3文字の英単語を6回以内に当てるWordle風のゲームです。Next.js（App Router）とTailwind CSSで作成しています。

## 機能

- 3文字の英単語をランダムに出題（20語収録）
- 最大6回まで挑戦可能
- 1文字ごとに正誤を色で判定（同じ文字が2回出てくる単語も正しく判定）
  - 緑: 位置も文字も正解
  - 黄: 単語に含まれるが位置が違う
  - 灰: 単語に含まれない
- 画面上のキーボードにも、これまでの判定結果を色で表示
- 物理キーボード / 画面上キーボードの両方で入力可能
- 成功・失敗の結果表示ともう一度遊ぶ（リセット）機能
- プレイ回数・勝率・連続正解数・最高連続正解数の統計をlocalStorageに保存

## 使用技術

- Next.js 16（App Router）
- React 19（useState / useEffect / useCallback）
- JavaScript（TypeScriptは未使用）
- Tailwind CSS 4
- Web Crypto API（`crypto.getRandomValues()` で出題単語を選択）
- localStorage
- デプロイ: Cloudflare Pages（静的書き出し `output: "export"`）
