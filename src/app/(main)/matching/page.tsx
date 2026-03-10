"use client";

import { useState, useEffect } from "react";
import { Filter, Heart, X, MessageCircle, Zap } from "lucide-react";

// 阪大の学部・学科データ
const osakaUFaculties: Record<string, string[]> = {
  "文学部": ["人文学科"],
  "人間科学部": ["人間科学科"],
  "外国語学部": ["外国語学科"],
  "法学部": ["法学科", "国際公共政策学科"],
  "経済学部": ["経済・経営学科", "経済学科"],
  "理学部": ["数学科", "物理学科", "化学科", "生物科学科"],
  "医学部": ["医学科", "保健学科"],
  "歯学部": ["歯学科"],
  "薬学部": ["薬学科", "薬科学科"],
  "工学部": ["応用自然科学科", "応用理工学科", "電子情報工学科", "環境・エネルギー工学科", "地球総合工学科"],
  "基礎工学部": ["電子物理科学科", "化学応用科学科", "システム科学科", "情報科学科"],
};

// 派手な背景グラデーションパターンのパレット
const BG_GRADIENTS = [
  "from-pink-500 via-purple-500 to-indigo-600",
  "from-cyan-400 via-blue-500 to-blue-700",
  "from-amber-400 via-orange-500 to-red-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-violet-500 via-fuchsia-500 to-pink-500",
];

// 絵文字のバリエーション（ダミー画像用）
const AVATAR_EMOJIS = ["🎧", "🚀", "🎸", "📚", "☕", "🎮", "🚴‍♂️", "🍣"];

export default function MatchingPage() {
  const [filterGrade, setFilterGrade] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterHobby, setFilterHobby] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [likedUsers, setLikedUsers] = useState<Record<number, boolean>>({});
  const [popHeartId, setPopHeartId] = useState<number | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 初回マウント時やフィルター変更時にユーザーを取得する
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        
        // パラメータを組み立てる
        const params = new URLSearchParams();
        if (filterDepartment) params.append("department", filterDepartment);
        // 学部はAPI仕様書にdepartmentしかないため、学部だけで検索する場合はdepartmentに学部名を送るなど調整が必要かもしれませんが仕様通りに
        if (!filterDepartment && filterFaculty) params.append("department", filterFaculty);
        if (filterHobby) params.append("habit", filterHobby.split(" ").join(",")); // スペース区切りをカンマに変換

        const query = params.toString();
        const url = `https://campus-match-api.onrender.com/users/search${query ? "?" + query : ""}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          // APIからのデータ形式をアプリの形式にマッピングする（足りない項目は仮埋め）
          const mappedUsers = data.map((u: any) => ({
            id: u.user_id || u.id,
            name: u.nickname || u.name || "名無し",
            age: u.age || 20,
            grade: u.grade || "B1",
            faculty: u.faculty || "",
            department: u.department || "",
            bio: u.bio || "よろしくお願いします。",
            tags: u.habit || [],
          }));
          setUsers(mappedUsers);
        } else {
          console.error("ユーザー取得失敗", res.status);
          setUsers([]);
        }
      } catch (err) {
        console.error("通信エラー", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [filterDepartment, filterFaculty, filterHobby]); // 学年と年齢はAPIで未サポートのためクライアント側でフィルタするなら別処理が必要だが、一旦全て再取得


  const filteredUsers = users.filter((user) => {
    // API側で対応していないフィルタ（学年、年齢など）はフロントエンドで絞り込む
    const matchGrade = filterGrade ? user.grade === filterGrade : true;
    const matchAge = filterAge ? user.age.toString() === filterAge : true;
    return matchGrade && matchAge;
  });

  const availableDepartments = filterFaculty ? osakaUFaculties[filterFaculty] : [];

  // いいね機能＆ドーパミン演出
  const handleLike = async (id: number) => {
    // 巨大なハートを表示して消すアニメーション演出
    setPopHeartId(id);
    setTimeout(() => setPopHeartId(null), 800);
    setLikedUsers(prev => ({ ...prev, [id]: true }));
    
    // バックエンドにいいねを送信
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("https://campus-match-api.onrender.com/interactions/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ to_user_id: String(id) })
      });
      if (res.ok) {
        const data = await res.json();
        // if_matchがtrueならマッチング成立の演出を出す
        if (data.is_match) {
           alert("マッチしました！"); // 本来は専用のド派手な演出にするとなお良い
        }
      }
    } catch (err) {
      console.error("いいね送信エラー:", err);
    }

    // スムーズに次の人へスクロールさせる（TikTok的ハック）
    setTimeout(() => {
      const parent = document.getElementById("scroll-container");
      if (parent) {
        parent.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }, 600);
  };

  const handleSkip = () => {
    const parent = document.getElementById("scroll-container");
    if (parent) {
      parent.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen w-full bg-black relative overflow-hidden font-sans">
      
      {/* 画面左上のロゴ (Floating) */}
      <div className="absolute top-5 left-4 z-40 flex flex-col pointer-events-none drop-shadow-md">
        <span className="text-[9px] font-bold text-white/80 tracking-[0.25em] mb-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">OSAKA UNIV.</span>
        <h1 className="text-xl font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">さがす</h1>
      </div>

      {/* 画面右上のフィルターボタン (Floating) */}
      <button 
        onClick={() => setShowFilter(true)} 
        className="absolute top-4 right-4 z-40 bg-black/40 backdrop-blur-md p-3.5 rounded-full text-white shadow-xl hover:bg-black/60 transition active:scale-95 border border-white/10"
      >
        <Filter size={24} />
      </button>

      {/* スワイプできるコンテナ (Snap Scroll) */}
      <div 
        id="scroll-container"
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll [&::-webkit-scrollbar]:hidden"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-900 text-teal-400">
            <span className="animate-pulse font-bold">読み込み中...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <span className="text-6xl block mb-4">😵</span>
              <p className="font-bold">条件に合うユーザーがいません</p>
            </div>
          </div>
        ) : (
          filteredUsers.map((user, idx) => {
            // 背景やアイコンを固定シードでランダムに割り当て
            // idが文字列の可能性も考慮して文字コードによるハッシュを使うか、一旦インデックスを使う
            const idKey = typeof user.id === 'number' ? user.id : String(user.id).charCodeAt(0) || idx;
            const bgClass = BG_GRADIENTS[idKey % BG_GRADIENTS.length];
            const activeEmoji = AVATAR_EMOJIS[idKey % AVATAR_EMOJIS.length];

            return (
              <div key={user.id} className="h-[calc(100dvh-4rem)] md:h-[100dvh] w-full snap-start snap-always relative flex flex-col justify-end overflow-hidden group">
                
                {/* 鮮烈な背景グラデーションを敷き詰めて視界をジャックする */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} opacity-90 transition-transform duration-700 ease-out group-hover:scale-105`} />
                <div className="absolute inset-0 bg-black/20" /> {/* 少し暗くして文字を読みやすく */}

                {/* 画面中央の巨大な絵文字（ダミーアバター） */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-[160px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform -translate-y-8 group-hover:rotate-6 transition-transform duration-700">
                    {activeEmoji}
                  </div>
                </div>

                {/* いいねを押した瞬間のドーパミン噴出ハート！ */}
                <div className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none transition-all duration-300 ${popHeartId === user.id ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                  <Heart size={200} fill="#ff2a55" color="#ff2a55" className="drop-shadow-[0_0_80px_rgba(255,42,85,1)]" />
                </div>

                {/* 右側のアクションボタン群 (TikTok式 UI) */}
                <div className="absolute right-3.5 bottom-28 flex flex-col items-center gap-6 z-30">
                  
                  {/* いいねボタン */}
                  <button 
                    onClick={() => handleLike(user.id)}
                    className="flex flex-col items-center group/btn active:scale-75 transition-transform duration-150"
                  >
                    <div className={`w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-colors ${likedUsers[user.id] ? "bg-white" : "bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60"}`}>
                      <Heart 
                        size={28} 
                        fill={likedUsers[user.id] ? "#ff2a55" : "none"} 
                        color={likedUsers[user.id] ? "#ff2a55" : "white"} 
                        strokeWidth={likedUsers[user.id] ? 0 : 2}
                      />
                    </div>
                    <span className="text-[13px] font-extrabold text-white mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">スキ</span>
                  </button>
                  
                  {/* スキップ（Nope）ボタン */}
                  <button 
                    onClick={handleSkip}
                    className="flex flex-col items-center group/btn active:scale-75 transition-transform duration-150"
                  >
                    <div className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-black/60">
                      <X size={24} color="white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[12px] font-bold text-white/90 mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">パス</span>
                  </button>

                  <button className="flex flex-col items-center group/btn active:scale-75 transition-transform duration-150">
                    <div className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-black/60">
                      <MessageCircle size={24} color="white" />
                    </div>
                    <span className="text-[12px] font-bold text-white/90 mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">語る</span>
                  </button>
                  
                  <button className="flex flex-col items-center group/btn active:scale-75 transition-transform duration-150">
                    <div className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-black/60">
                      <Zap size={24} color="#fbbf24" fill="#fbbf24" />
                    </div>
                    <span className="text-[12px] font-bold text-amber-400 mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">SUPER</span>
                  </button>
                </div>

                {/* ユーザー情報 (左下に配置されるグラデーション背景上のテキスト) */}
                <div className="absolute bottom-0 left-0 right-16 p-6 pb-8 pt-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 pointer-events-none">
                  <h2 className="text-[32px] font-black text-white leading-tight drop-shadow-xl flex items-end gap-2">
                    {user.name} 
                    <span className="text-xl font-bold text-white/80 pb-1">{user.age}</span>
                  </h2>
                  <p className="text-[#00ffd5] font-extrabold mt-1 text-[15px] drop-shadow-md tracking-wide">
                    {user.faculty} {user.department}・{user.grade}
                  </p>
                  
                  <div className="mt-3 overflow-hidden">
                    <p className="text-white/95 text-[15px] leading-relaxed drop-shadow-lg line-clamp-2 font-medium">
                      {user.bio}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.tags.map((tag: string) => (
                      <span key={tag} className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[13px] font-bold text-white border border-white/30 shadow-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ======= フィルター用モーダル (ガラスモーフィズムチックに) ======= */}
      {showFilter && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Filter size={20} className="text-teal-500" /> 条件をしぼる
              </h3>
              <button 
                onClick={() => setShowFilter(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* モーダルコンテンツ (スクロール可能) */}
            <div className="p-5 overflow-y-auto overflow-x-hidden flex-1 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                {/* 学年 */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">学年</label>
                  <select
                    value={filterGrade}
                    onChange={e => setFilterGrade(e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
                  >
                    <option value="">すべて</option>
                    <option value="B1">学部1年 (B1)</option>
                    <option value="B2">学部2年 (B2)</option>
                    <option value="B3">学部3年 (B3)</option>
                    <option value="B4">学部4年 (B4)</option>
                    <option value="M1">修士1年 (M1)</option>
                    <option value="M2">修士2年 (M2)</option>
                    <option value="D1">博士1年 (D1)</option>
                    <option value="D2">博士2年 (D2)</option>
                    <option value="D3">博士3年 (D3)</option>
                  </select>
                </div>

                {/* 年齢 */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">年齢</label>
                  <select
                    value={filterAge}
                    onChange={e => setFilterAge(e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
                  >
                    <option value="">すべて</option>
                    {Array.from({ length: 14 }, (_, i) => i + 17).map((age) => (
                      <option key={age} value={age.toString()}>{age}歳</option>
                    ))}
                  </select>
                </div>

                {/* 学部 */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-600 mb-2">学部</label>
                  <select
                    value={filterFaculty}
                    onChange={e => {
                      setFilterFaculty(e.target.value);
                      setFilterDepartment(""); 
                    }}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
                  >
                    <option value="">すべて</option>
                    {Object.keys(osakaUFaculties).map((faculty) => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>

                {/* 学科 */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-600 mb-2">学科</label>
                  <select
                    value={filterDepartment}
                    onChange={e => setFilterDepartment(e.target.value)}
                    disabled={!filterFaculty} 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium appearance-none disabled:bg-gray-100 disabled:opacity-50"
                  >
                    <option value="">すべて</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* 趣味・タグ */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-600 mb-2">キーワード・趣味</label>
                  <input
                    type="text"
                    placeholder="例: カフェ, アニメ"
                    value={filterHobby}
                    onChange={e => setFilterHobby(e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 rounded-b-3xl flex-shrink-0">
              <button 
                onClick={() => {
                  setFilterGrade(""); setFilterAge(""); setFilterFaculty(""); setFilterDepartment(""); setFilterHobby("");
                }}
                className="flex-1 py-3.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                クリア
              </button>
              <button 
                onClick={() => setShowFilter(false)}
                className="flex-[2] py-3.5 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 transition"
              >
                {filteredUsers.length}人を表示
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}