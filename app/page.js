"use client";

import dynamic from "next/dynamic";

// Gameコンポーネントはブラウザの localStorage を使うため、
// サーバー側では描画せずクライアント側だけで読み込む(ssr: false)。
//
// 【なぜssr: falseが必要か】
// このNext.jsのバージョンでは、ssr: falseはServer Component(app/page.js本体)
// の中では使えない制約があるため、page.js自体を"use client"にした上で
// dynamic importに ssr: false を指定している。
const Game = dynamic(() => import("./components/Game"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <Game />
    </div>
  );
}
