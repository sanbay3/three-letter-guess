import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "3文字あてゲーム",
  description: "3文字の英単語を6回以内に当てるゲーム",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            by <span className="brand">さんべい</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
