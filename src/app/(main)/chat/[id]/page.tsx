"use client";

import { useState, useEffect, use } from "react"; // use を追加
import { useRouter } from "next/navigation";

// ① params の型定義を Promise にする（Next.js 15以降の仕様）
export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // ② use(params) を使って、中身が確定するのを待つ
  const resolvedParams = use(params);
  const chatId = resolvedParams.id;

  const [inputText, setInputText] = useState("");

  // データリスト
  const allPartners: { [key: string]: { name: string, avatar: string } } = {
    "chat-1": { name: "ミカ", avatar: "👩‍🎓" },
    "chat-2": { name: "ヤマダ", avatar: "👨‍🎓" },
    "chat-3": { name: "タナカ", avatar: "👨‍🎓" },
  };

  // ③ chatId を使って相手を特定
  const partner = allPartners[chatId] || { name: "不明なユーザー", avatar: "👤" };

  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: `こんにちは！${partner.name}です！`, time: "10:00" },
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-400 text-xl mr-3">←</button>
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xl mr-3">
          {partner.avatar}
        </div>
        <h1 className="font-bold text-gray-800">{partner.name}</h1>
      </header>

      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
              msg.sender === "me" 
                ? "bg-teal-600 text-white rounded-tr-none" 
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === "me" ? "text-teal-100" : "text-gray-400"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 入力フォーム */}
      <div className="p-4 bg-white border-t border-gray-100 pb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={`${partner.name}さんにメッセージを送る...`}
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button onClick={handleSendMessage} className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
            ✈️
          </button>
        </div>
      </div>
    </main>
  );
}