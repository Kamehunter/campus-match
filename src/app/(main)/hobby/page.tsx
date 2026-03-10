"use client";
import { useState, useEffect } from "react";
import { Check, ChevronRight, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Hobby = {
  id: number;
  name: string;
  parent_id: number | null;
  depth: number;
};

// サンプルデータ（指定の階層構造）
const HOBBIES: Hobby[] = [
  // スポーツ関連
  { id: 1, name: "スポーツ", parent_id: null, depth: 0 },
  { id: 2, name: "野球", parent_id: 1, depth: 1 },
  { id: 3, name: "阪神", parent_id: 2, depth: 2 },
  { id: 4, name: "オリックス", parent_id: 2, depth: 2 },
  { id: 5, name: "サッカー", parent_id: 1, depth: 1 },
  { id: 6, name: "Jリーグ", parent_id: 5, depth: 2 },
  { id: 7, name: "海外サッカー", parent_id: 5, depth: 2 },
  { id: 8, name: "テニス", parent_id: 1, depth: 1 },

  // 音楽関連
  { id: 9, name: "音楽", parent_id: null, depth: 0 },
  { id: 10, name: "邦ロック", parent_id: 9, depth: 1 },
  { id: 11, name: "BUMP OF CHICKEN", parent_id: 10, depth: 2 },
  { id: 12, name: "RADWIMPS", parent_id: 10, depth: 2 },
  { id: 13, name: "K-POP", parent_id: 9, depth: 1 },
  { id: 14, name: "NewJeans", parent_id: 13, depth: 2 },
  { id: 15, name: "TWICE", parent_id: 13, depth: 2 },
  { id: 16, name: "クラシック", parent_id: 9, depth: 1 },

  // エンタメ関連
  { id: 17, name: "エンタメ", parent_id: null, depth: 0 },
  { id: 18, name: "アニメ", parent_id: 17, depth: 1 },
  { id: 19, name: "少年漫画系", parent_id: 18, depth: 2 },
  { id: 20, name: "日常・きらら系", parent_id: 18, depth: 2 },
  { id: 21, name: "ゲーム", parent_id: 17, depth: 1 },
  { id: 22, name: "FPS (Apex, VALORANT等)", parent_id: 21, depth: 2 },
  { id: 23, name: "RPG・ソシャゲ", parent_id: 21, depth: 2 },

  // ライフスタイル関連
  { id: 24, name: "ライフスタイル", parent_id: null, depth: 0 },
  { id: 25, name: "カフェ巡り", parent_id: 24, depth: 1 },
  { id: 26, name: "スタバ", parent_id: 25, depth: 2 },
  { id: 27, name: "レトロ喫茶", parent_id: 25, depth: 2 },
  { id: 28, name: "車・バイク", parent_id: 24, depth: 1 },
  { id: 29, name: "ツーリング", parent_id: 28, depth: 2 },
  { id: 30, name: "温泉・サウナ", parent_id: 24, depth: 1 },
];

export default function HobbyPage() {
  const router = useRouter();
  
  // 選択状態と展開状態の管理
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // マウント時に現在の趣味を取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("https://campus-match-api.onrender.com/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          // APIから返ってきた habit (配列) に一致する HOBBIES の id を選択済みにする
          if (data.habit && Array.isArray(data.habit)) {
            const initialSelected = new Set<number>();
            data.habit.forEach((h: string) => {
              const matched = HOBBIES.find(hobby => hobby.name === h);
              if (matched) initialSelected.add(matched.id);
            });
            setSelectedIds(initialSelected);
          }
        }
      } catch (err) {
        console.error("プロフィール取得エラー", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 選択されている趣味の配列
  const selectedHobbies = HOBBIES.filter(h => selectedIds.has(h.id));

  // ツリー状に再帰的に描画する関数
  const renderHobbyTree = (parentId: number | null) => {
    const children = HOBBIES.filter(h => h.parent_id === parentId);
    if (children.length === 0) return null;

    return children.map(hobby => {
      const hasChildren = HOBBIES.some(h => h.parent_id === hobby.id);
      const isExpanded = expandedIds.has(hobby.id);
      const isSelected = selectedIds.has(hobby.id);

      return (
        <div key={hobby.id} className="w-full flex flex-col">
          <div className={`flex border-b border-gray-100 transition-colors ${isSelected ? 'bg-teal-50/60' : 'bg-white'}`}>
            
            {/* 左側：チェックボックス＋テキストエリア（選択用） */}
            <div 
              onClick={() => toggleSelection(hobby.id)}
              style={{ paddingLeft: `${hobby.depth * 1.5 + 1}rem` }}
              className="flex-1 flex items-center py-3.5 gap-3 cursor-pointer select-none"
            >
              <div className={`w-6 h-6 rounded-md border-2 flex shrink-0 items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'}`}>
                {isSelected && <Check size={16} strokeWidth={3} />}
              </div>
              <span className={`font-bold tracking-wide ${isSelected ? 'text-teal-800' : 'text-gray-700'} ${hobby.depth === 0 ? 'text-[15px]' : 'text-[14px]'}`}>
                {hobby.name}
              </span>
            </div>

            {/* 右側：矢印アイコンエリア（展開用） */}
            {hasChildren && (
              <div 
                onClick={() => toggleExpand(hobby.id)}
                className="flex items-center justify-center px-4 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                {isExpanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
              </div>
            )}
          </div>

          {/* 子要素（展開時のみ表示） */}
          {hasChildren && isExpanded && (
            <div className="flex flex-col relative bg-gray-50/30">
              {/* 左側の階層ガイドとなる縦線 */}
              <div 
                className="absolute w-px bg-gray-200" 
                style={{ 
                  left: `${hobby.depth * 1.5 + 1.75}rem`, 
                  top: 0, 
                  bottom: 0 
                }} 
              />
              {renderHobbyTree(hobby.id)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-36">
      {/* ヘッダーエリア */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mb-0.5">OSAKA UNIV.</span>
          <h1 className="text-lg font-black text-teal-700 leading-none">趣味・関心の登録</h1>
        </div>
      </header>

      {/* 選択した趣味のピン留め表示エリア */}
      <div className="sticky top-[60px] z-20 bg-white shadow-sm border-b border-teal-100/50 px-4 py-3 min-h-[5.5rem]">
        <p className="text-xs font-extrabold text-teal-700 mb-2.5">
          選択中 ({selectedIds.size})
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {selectedHobbies.length === 0 ? (
            <span className="text-gray-400 text-[13px] font-medium">リストから趣味を選択してください👇</span>
          ) : (
            selectedHobbies.map(h => (
              <span key={h.id} className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm font-bold animate-in zoom-in duration-200">
                {h.name}
                <button 
                  onClick={() => toggleSelection(h.id)} 
                  className="text-teal-400 hover:text-teal-600 hover:bg-teal-100 rounded-full p-0.5 transition"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* メインの階層ツリー */}
      <div className="max-w-md mx-auto mt-4 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {renderHobbyTree(null)}
        </div>
      </div>

      {/* フッターとしての保存ボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-40 md:pl-64 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto pb-4">
          <button 
            onClick={async () => {
              try {
                const token = localStorage.getItem("access_token");
                const habitNames = selectedHobbies.map(h => h.name);
                const res = await fetch("https://campus-match-api.onrender.com/profile/me", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({ habit: habitNames })
                });
                if (res.ok) {
                  console.log("保存した趣味:", habitNames);
                  router.back();
                } else {
                  console.error("保存エラー", res.status);
                }
              } catch (err) {
                console.error("通信エラー", err);
              }
            }}
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] transition active:scale-95 text-lg flex justify-center items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            <Check size={20} strokeWidth={3} />
            {loading ? "読み込み中..." : "この内容で保存する"}
          </button>
        </div>
      </div>
    </main>
  );
}
