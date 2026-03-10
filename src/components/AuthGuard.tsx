"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 1. まずマウントされたかどうかを判定（hydration対応）
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. トークンなしでもアクセス可能な一般公開ページ（ただしsignup/profileは除外する）
  const publicPages = ["/", "/login", "/signup", "/signup/success"];
  const isPublicPage = publicPages.includes(pathname);
  const isTopOrAuthPage = ["/", "/login", "/signup"].includes(pathname);

  // 3. ローカルストレージはブラウザ上(mounted)でのみ安全にアクセスできる
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  // 4. リダイレクト判定
  useEffect(() => {
    if (!mounted) return;

    if (!token && !isPublicPage) {
      // トークンを持っていないのに、公開ページ「以外」にアクセスした場合はトップページへ強制リダイレクト
      router.push("/");
    } else if (token && isTopOrAuthPage) {
      // トークンを持っているのに、トップやログイン画面にアクセスした場合はアプリ内へ移動
      router.push("/matching");
    }
  }, [pathname, mounted, token, isPublicPage, isTopOrAuthPage, router]);

  // ローディング画面のUIコンポーネント
  const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <span className="text-teal-600 font-bold tracking-widest text-lg mb-2 text-center">CAMPUS MATCH</span>
        <span className="text-gray-400 text-xs text-center font-medium">読込中...</span>
      </div>
    </div>
  );

  // マウント前はローディングを表示
  if (!mounted) {
    return <LoadingScreen />;
  }

  // リダイレクト条件に引っかかっている場合は、実際のページを出さずにローディングのまま（ルーティング中）
  if ((!token && !isPublicPage) || (token && isTopOrAuthPage)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
