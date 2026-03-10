"use client";

import { useState } from "react";
import { Sparkles, UserPlus, Check, X, Bell, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LikedPage() {
  const [likedUsers, setLikedUsers] = useState([
    {
      id: 101,
      name: "ミカ",
      age: 20,
      faculty: "文学部",
      department: "人文学科",
      message: "VTR250、かっこいいですね！私もバイク興味あります🏍️",
      time: "2時間前",
      avatar: "👩‍🎓",
    },
    {
      id: 102,
      name: "サトウ",
      age: 21,
      faculty: "基礎工学部",
      department: "システム科学科",
      message: "量子力学の課題、僕も苦戦してます…！カフェで一緒に勉強しませんか？☕",
      time: "昨日",
      avatar: "👨‍🎓",
    },
    {
      id: 103,
      name: "ユイ",
      age: 19,
      faculty: "経済学部",
      department: "経済学科",
      message: "プロフィール写真、すごくおしゃれですね✨ よかったらお話ししてみたいです！",
      time: "昨日",
      avatar: "☕",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<"match" | "skip" | null>(null);
  const [showConnectSplash, setShowConnectSplash] = useState(false);

  const remainingUsers = likedUsers.length - currentIndex;
  const currentUser = likedUsers[currentIndex];

  // つながる（マッチ）アクション
  const handleConnect = () => {
    setIsAnimating("match");
    setShowConnectSplash(true);

    // 爽快感のあるサクセス演出を見せた後、次の人へ
    setTimeout(() => {
      setShowConnectSplash(false);
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(null);
    }, 1800);
  };

  // 今回は見送る（スキップ）アクション
  const handleSkip = () => {
    setIsAnimating("skip");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(null);
    }, 400); // すっと消える
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 font-sans overflow-hidden">
      
      {/* ===== ヘッダー ===== */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-teal-700 flex items-center gap-2">
          <Bell size={20} className="text-teal-500 fill-teal-100" />
          届いた「いいね」
        </h1>
        
        {/* 右上の人数カウンター（通知バッジ風） */}
        {remainingUsers > 0 ? (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full shadow-sm animate-in fade-in slide-in-from-top-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <span className="text-sm font-bold text-teal-700">あと {remainingUsers}人</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-sm font-bold">
            0人
          </div>
        )}
      </header>

      {/* ===== メインコンテンツ ===== */}
      <div className="max-w-md mx-auto px-4 mt-8 relative">
        
        {remainingUsers > 0 && currentUser ? (
          
          /* 一人ずつ表示するカード UI */
          <div 
            key={currentUser.id}
            className={`
              relative bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 pt-12 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isAnimating === "match" ? "scale-105 opacity-0 -translate-y-8 blur-sm pointer-events-none" : ""}
              ${isAnimating === "skip" ? "scale-95 opacity-0 translate-y-8 blur-sm pointer-events-none" : ""}
              ${!isAnimating ? "animate-in slide-in-from-bottom-8 fade-in zoom-in-95" : ""}
            `}
          >
            {/* アバター部分（カードの上部に少しはみ出すデザイン） */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl relative group">
                {currentUser.avatar}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="text-center mt-6">
              <h2 className="text-2xl font-extrabold text-gray-800 flex items-end justify-center gap-2 tracking-tight">
                {currentUser.name} 
                <span className="text-base font-bold text-gray-400 mb-0.5">{currentUser.age}歳</span>
              </h2>
              <p className="text-sm font-bold text-teal-600 mt-2 bg-teal-50 inline-block px-3 py-1 rounded-full border border-teal-100">
                {currentUser.faculty} {currentUser.department}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-3">
                {currentUser.time}
              </p>
            </div>

            {/* メッセージ */}
            <div className="mt-8 relative">
              <div className="absolute -left-2 -top-4 text-4xl text-teal-100 font-serif">"</div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner relative z-10 text-center">
                <p className="text-gray-700 font-medium leading-relaxed text-[15px]">
                  {currentUser.message}
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={handleConnect}
                disabled={isAnimating !== null}
                className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_-6px_rgba(13,148,136,0.5)] hover:bg-teal-700 transition-all active:scale-95 group overflow-hidden relative"
              >
                {/* ボタン内のキラキラ光るエフェクト（シアー） */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                <UserPlus size={20} />
                <span className="text-lg tracking-wide">つながる</span>
              </button>
              
              <button 
                onClick={handleSkip}
                disabled={isAnimating !== null}
                className="w-full py-4 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
              >
                今回は見送る
              </button>
            </div>
            
          </div>
          
        ) : (
          
          /* すべて確認し終わった時の画面 */
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-teal-100">
              <CheckCircle2 size={48} className="text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">すべて確認しました！</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
              新しい人との出会いを探しに、「さがす」画面を見てみましょう。
            </p>
            <Link 
              href="/matching" 
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-50 transition-colors shadow-sm"
            >
              さがす画面へ <ChevronRight size={18} />
            </Link>
          </div>
          
        )}
      </div>

      {/* ===== 「つながった！」瞬間の大快感アニメーション（Tealベース） ===== */}
      {showConnectSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* 背景の白いフラッシュと光 */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm animate-in fade-in duration-200"></div>
          
          <div className="relative z-10 flex flex-col items-center animate-in zoom-in-50 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="w-32 h-32 bg-teal-500 rounded-full shadow-[0_0_60px_rgba(20,184,166,0.5)] flex items-center justify-center mb-6 relative">
              {/* 波紋エフェクト */}
              <div className="absolute inset-0 rounded-full border-4 border-teal-400 animate-ping opacity-75"></div>
              <div className="absolute -inset-4 rounded-full border-2 border-teal-300 animate-ping opacity-50" style={{ animationDelay: "150ms" }}></div>
              <Check size={64} className="text-white drop-shadow-md" strokeWidth={3} />
            </div>
            
            <h2 className="text-4xl font-black text-teal-600 tracking-widest drop-shadow-sm">
              MATCHED!
            </h2>
            <p className="text-teal-500 font-bold mt-2 bg-teal-50 px-4 py-1.5 rounded-full shadow-sm">
              メッセージを送ってみましょう
            </p>
          </div>
        </div>
      )}

      {/* tailwind のカスタムアニメーション定義用 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </main>
  );
}