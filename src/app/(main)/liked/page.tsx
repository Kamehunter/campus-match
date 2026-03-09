"use client";

import { useState } from "react";
import Link from "next/link";

export default function LikedPage() {
  // ① 自分にいいねしてくれた人の仮データ（モックデータ）
  const [likedUsers, setLikedUsers] = useState([
    {
      id: 101,
      name: "ミカ",
      faculty: "文学部",
      department: "人文学科",
      message: "VTR250、かっこいいですね！私もバイク興味あります。",
      time: "2時間前",
      avatar: "👩‍🎓"
    },
    {
      id: 102,
      name: "サトウ",
      faculty: "基礎工学部",
      department: "システム科学科",
      message: "量子力学の課題、僕も苦戦してます…！",
      time: "昨日",
      avatar: "👨‍🎓"
    },
  ]);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-teal-600 text-center">
          いいねしてくれた人
        </h1>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {likedUsers.length > 0 ? (
          likedUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-sm p-5 border border-teal-100 relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-bold text-gray-800">{user.name}</h2>
                      <p className="text-[10px] text-teal-600 font-medium">
                        {user.faculty} {user.department}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400">{user.time}</span>
                  </div>
                  
                  {/* 相手からのメッセージ */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border-l-4 border-teal-500">
                    <p className="text-sm text-gray-700">
                      「{user.message}」
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition shadow-md">
                      ありがとう（マッチ！）
                    </button>
                    <button className="px-4 py-3 bg-gray-100 text-gray-400 rounded-xl text-sm hover:bg-gray-200 transition">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📩</div>
            <p className="text-gray-400">
              まだいいねは届いてへんみたいや。<br />
              自分から「さがす」でアクションしてみよか！
            </p>
          </div>
        )}
      </div>
    </main>
  );
}