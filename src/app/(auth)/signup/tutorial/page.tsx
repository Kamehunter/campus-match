"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ページ移動用の道具
import Link from "next/link";

export default function TutorialPage() {
  const [step, setStep] = useState(1); // 今何枚目のスライドか
  const router = useRouter();

  // スライドの内容を配列にしておく
  const contents = [
    {
      title: "CAMPUS MATCHへようこそ！",
      description: "ここは阪大生限定のコミュニティ。まずはプロフィールを充実させて、パートナーを見つけよう。",
      icon: "🎉",
    },
    {
      title: "マッチングの仕組み",
      description: "気になる人に良いねを送ってマッチしよう。共通の趣味を持つ人と繋がれるで。",
      icon: "🤝",
    },
    {
      title: "安心・安全のために",
      description: "不適切な投稿やメッセージを見つけたらすぐに通報・ブロック機能を使ってな。運営もしっかりチェックしてるで。",
      icon: "🛡️",
    },
  ];

  const handleNext = () => {
    if (step < contents.length) {
      setStep(step + 1);
    } else {
      // 最後まで行ったらメイン画面へ移動
      router.push("/matching");
    }
  };

  const currentContent = contents[step - 1];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
        {/* ステップ表示 */}
        <div className="flex justify-center gap-2 mb-8">
          {contents.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-12 rounded-full transition-all ${
                i + 1 === step ? "bg-teal-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* コンテンツエリア */}
        <div className="mb-10 animate-fade-in">
          <div className="text-6xl mb-6">{currentContent.icon}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{currentContent.title}</h1>
          <p className="text-gray-600 leading-relaxed">{currentContent.description}</p>
        </div>

        {/* ボタンエリア */}
        <div className="space-y-3">
          <button 
            onClick={handleNext}
            className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold hover:bg-teal-700 transition"
          >
            {step === contents.length ? "はじめる！" : "次へ進む"}
          </button>
          
          {step < contents.length && (
            <button 
              onClick={() => router.push("/matching")}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              チュートリアルをスキップ
            </button>
          )}
        </div>
      </div>
    </main>
  );
}