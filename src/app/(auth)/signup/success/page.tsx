"use client";

import Link from "next/link";
import { CheckCircle2, Clock, UserCheck } from "lucide-react";

export default function SignupSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100 my-8 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* アクセントライン */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>

        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-20 transform scale-150"></div>
          <CheckCircle2 size={72} className="text-teal-500 relative z-10" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-4 tracking-tight">
          登録の申請が完了しました！
        </h1>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          学生証のアップロードありがとうございます。<br />
          現在、運営チームで内容を確認しております。
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 shadow-inner">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Clock size={16} className="text-teal-600" />
            今後の流れ
          </h3>
          <ul className="text-xs text-gray-500 space-y-3 font-medium">
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">1.</span>
              <span>通常、24時間以内に学生証の確認が完了します。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">2.</span>
              <span>審査が完了次第、入力いただいたメールアドレス宛にお知らせします。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">3.</span>
              <span>メール確認後、ログインしてアプリを使い始めることができます！</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/signup/profile"
            className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white p-4 rounded-2xl font-bold hover:from-teal-600 hover:to-teal-800 transition-all transform hover:scale-[1.02] shadow-md shadow-teal-500/30"
          >
            <UserCheck size={20} />
            続けてプロフィールを作成する
          </Link>
          
          <Link 
            href="/"
            className="w-full inline-flex justify-center items-center gap-2 bg-gray-50 text-gray-500 p-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            あとで設定してトップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}