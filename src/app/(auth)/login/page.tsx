"use client";
import Link from "next/link";

import { useState } from "react";

export default function LoginPage() {
  // ① 変数名を studentId から email に変更や！
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 物理の実験データを確認するように、まずは中身をチェック
    console.log("ログイン情報:", { email, password });
    alert(`${email} でログインを試みるで！`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border-t-4 border-teal-600">
        <h1 className="text-2xl font-bold text-center mb-6 text-teal-600">CAMPUS MATCH</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input 
              type="email" // ② typeを "email" にするのがポイント
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@osaka-u.ac.jp"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-teal-600 text-white p-2 rounded font-bold hover:bg-teal-700 transition duration-200"
          >
            ログイン
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            アカウントを持ってへん？{" "}
            <Link href="/signup" className="text-teal-600 font-bold hover:underline">
              新規登録はこちら
            </Link>
          </p>
        </div>
        




        
      </div>
    </main>
  );
}