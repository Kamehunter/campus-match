"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
      {/* 背景の装飾 (ぼかしの入ったグラデーション円) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* ナビゲーションバー */}
      <nav className="relative z-10 w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
            <span className="text-white font-extrabold text-xl">C</span>
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
            CAMPUS MATCH
          </span>
        </div>
        <div>
          <Link 
            href="/login"
            className="hidden sm:inline-flex px-6 py-2.5 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-full transition-all"
          >
            ログイン
          </Link>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 pt-10 pb-24 text-center">
        
        {/* 新着タグ */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-sm font-bold text-teal-700">
            <Sparkles size={16} className="text-yellow-500" />
            阪大生のための新しい繋がり
          </span>
        </div>

        {/* キャッチコピー */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          キャンパスライフを、<br />
          もっと<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">カラフル</span>に。
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-loose font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          授業の空きコマ、趣味の仲間探し、プロジェクトのメンバー募集。<br className="hidden md:block"/>
          阪大生限定の安心なコミュニティで、新しい自分に出会おう。
        </p>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-teal-500/30 overflow-hidden"
          >
            <span className="relative z-10">今すぐはじめる（無料）</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            {/* ホバー時の光沢エフェクト */}
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </Link>
          
          <Link 
            href="/login" 
            className="sm:hidden w-full px-10 py-5 bg-white text-teal-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm flex justify-center items-center"
          >
            ログインはこちら
          </Link>
        </div>

        {/* 特徴エリア (美しいカードで表現) */}
        <section className="mt-32 grid md:grid-cols-3 gap-8 text-left w-full animate-in fade-in duration-1000 delay-500">
          {/* カード 1 */}
          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-100 transition-all">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3 tracking-wide">完全招待/認証制</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              学生証による厳密な本人確認を実施。阪大生だけのクローズドで安全なコミュニティを維持しています。
            </p>
          </div>

          {/* カード 2 */}
          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-100 transition-all">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3 tracking-wide">空きコマで即マッチ</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              今いるキャンパスや、授業の合間の時間を使って、気軽にお茶やランチに行ける相手が見つかります。
            </p>
          </div>

          {/* カード 3 */}
          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3 tracking-wide">学部の垣根を越えて</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              普段出会うことのない他学部・他研究科の仲間と、趣味や研究テーマで繋がる新しい体験を提供します。
            </p>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="relative z-10 py-10 text-center text-gray-400 text-xs font-bold tracking-[0.2em] uppercase border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
        © 2026 CAMPUS MATCH • OSAKA UNIVERSITY
      </footer>
    </div>
  );
}