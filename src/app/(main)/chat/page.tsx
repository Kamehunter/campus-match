"use client";

import Link from "next/link";

export default function ChatListPage() {
  // ① マッチした人たちの仮データ
  const chatList = [
    {
      id: "chat-1",
      name: "ミカ",
      lastMessage: "VTR250、ぜひ今度見せてください！",
      time: "10:30",
      unread: true,
      avatar: "👩‍🎓",
    },
    {
      id: "chat-2",
      name: "ヤマダ",
      lastMessage: "統計学のノート、送りました！",
      time: "昨日",
      unread: false,
      avatar: "👨‍🎓",
    },
    {
      id: "chat-3",
      name: "タナカ",
      lastMessage: "了解です！また連絡します。",
      time: "2日前",
      unread: false,
      avatar: "👨‍🎓",
    },
  ];

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">チャット</h1>
        <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full font-bold">
          {chatList.filter(c => c.unread).length}件の未読
        </span>
      </header>

      {/* チャットリストエリア */}
      <div className="max-w-md mx-auto">
        {chatList.length > 0 ? (
          chatList.map((chat) => (
            <Link 
              key={chat.id} 
              href={`/chat/${chat.id}`} // ② 個別のチャット画面へ飛ぶパス
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50 active:bg-gray-100"
            >
              {/* アイコン */}
              <div className="relative">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {chat.avatar}
                </div>
                {/* 未読の赤い点 */}
                {chat.unread && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* テキスト内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h2 className="font-bold text-gray-800 truncate">{chat.name}</h2>
                  <span className="text-[10px] text-gray-400">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.unread ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                  {chat.lastMessage}
                </p>
              </div>

              {/* 矢印 */}
              <div className="text-gray-300 text-xs">＞</div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 px-6">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-400">まだマッチングした相手はおらへんで。<br />自分から「さがす」でアクションしてみよか！</p>
          </div>
        )}
      </div>
    </main>
  );
}