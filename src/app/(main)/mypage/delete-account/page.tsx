"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  
  // 退会を確定させるための合言葉
  const DELETE_WORD = "退会する";

  const handleDelete = () => {
    if (confirmText === DELETE_WORD) {
      // 本来はここでバックエンド（友人）に削除リクエストを送る
      alert("アカウントを削除したで。今までありがとうな。");
      router.push("/signup");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-8 border-red-500">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">アカウントの退会</h1>
        
        <div className="bg-red-50 p-4 rounded-xl mb-6">
          <p className="text-red-700 text-sm leading-relaxed">
            【警告】退会すると、これまでのマッチング履歴、メッセージ、プロフィール情報はすべて完全に削除され、復元はできへんで。
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600 text-sm text-center">
            確認のため、下に「<span className="font-bold text-gray-800">{DELETE_WORD}</span>」と入力してや。
          </p>

          <input 
            type="text" 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={DELETE_WORD}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-center"
          />

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleDelete}
              disabled={confirmText !== DELETE_WORD}
              className={`w-full py-4 rounded-xl font-bold transition ${
                confirmText === DELETE_WORD 
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              アカウントを完全に削除する
            </button>

            <button 
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 font-medium py-2"
            >
              やっぱりやめる
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}