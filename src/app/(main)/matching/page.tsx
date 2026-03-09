"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

// 阪大の学部・学科データ（主要なものを定義）
const osakaUFaculties: Record<string, string[]> = {
  "文学部": ["人文学科"],
  "人間科学部": ["人間科学科"],
  "外国語学部": ["外国語学科"],
  "法学部": ["法学科", "国際公共政策学科"],
  "経済学部": ["経済・経営学科", "経済学科"], // ダミーデータと合わせるために経済学科も追加
  "理学部": ["数学科", "物理学科", "化学科", "生物科学科"],
  "医学部": ["医学科", "保健学科"],
  "歯学部": ["歯学科"],
  "薬学部": ["薬学科", "薬科学科"],
  "工学部": ["応用自然科学科", "応用理工学科", "電子情報工学科", "環境・エネルギー工学科", "地球総合工学科"],
  "基礎工学部": ["電子物理科学科", "化学応用科学科", "システム科学科", "情報科学科"],
};

export default function MatchingPage() {
  const [filterGrade, setFilterGrade] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterHobby, setFilterHobby] = useState("");

  // ① 本来はバックエンドから取るけど、一旦「仮のユーザーリスト」を置くで
  const allUsers = [
    {
      id: 1,
      name: "コジコジ",
      age: 20,
      grade: "B2",
      faculty: "基礎工学部",
      department: "電子物理科学科",
      bio: "量子力学の課題、一緒にやらへん？",
      tags: ["物理", "バイク", "自炊"],
    },
    {
      id: 2,
      name: "サトウ",
      age: 21,
      grade: "B3",
      faculty: "経済学部",
      department: "経済学科",
      bio: "統計学のテスト対策募集中！カフェで勉強しましょう。",
      tags: ["カフェ巡り", "統計学", "テニス"],
    },
    {
      id: 3,
      name: "タナカ",
      age: 18,
      grade: "B1",
      faculty: "工学部",
      department: "応用自然科学科",
      bio: "プログラミング初心者です。Next.js教えてくれる人募集！",
      tags: ["プログラミング", "アニメ", "キャンプ"],
    },
    {
      id: 4,
      name: "ヤマモト",
      age: 19,
      grade: "B2",
      faculty: "文学部",
      department: "人文学科",
      bio: "映画好きな人と繋がりたいです！",
      tags: ["映画", "読書", "カフェ巡り"],
    },
    {
      id: 5,
      name: "ナカムラ",
      age: 24,
      grade: "D1",
      faculty: "基礎工学部",
      department: "情報科学科",
      bio: "AIの研究をしています！博士課程の方、仲良くしましょう。",
      tags: ["AI", "論文", "カフェ巡り"],
    },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchGrade = filterGrade ? user.grade === filterGrade : true;
    const matchAge = filterAge ? user.age.toString() === filterAge : true;
    const matchFaculty = filterFaculty ? user.faculty === filterFaculty : true;
    const matchDepartment = filterDepartment ? user.department === filterDepartment : true;
    const matchHobby = filterHobby ? user.tags.some(tag => tag.includes(filterHobby)) : true;

    return matchGrade && matchAge && matchFaculty && matchDepartment && matchHobby;
  });

  // 選択された学部の学科一覧を取得
  const availableDepartments = filterFaculty ? osakaUFaculties[filterFaculty] : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-teal-600 text-center w-full">さがす</h1>
      </header>

      {/* 検索フィルターUI */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>
          <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold border-b border-teal-50 pb-3">
            <Filter size={20} />
            <h2>条件で絞り込む</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* 学年 */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学年</label>
              <select
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-gray-700 appearance-none"
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
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">年齢</label>
              <select
                value={filterAge}
                onChange={e => setFilterAge(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium appearance-none"
              >
                <option value="">すべて</option>
                {Array.from({ length: 14 }, (_, i) => i + 17).map((age) => (
                  <option key={age} value={age.toString()}>{age}歳</option>
                ))}
              </select>
            </div>

            {/* 学部 */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学部</label>
              <select
                value={filterFaculty}
                onChange={e => {
                  setFilterFaculty(e.target.value);
                  setFilterDepartment(""); // 学部を変えたら学科をリセット
                }}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium appearance-none"
              >
                <option value="">すべて</option>
                {Object.keys(osakaUFaculties).map((faculty) => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>

            {/* 学科 */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学科</label>
              <select
                value={filterDepartment}
                onChange={e => setFilterDepartment(e.target.value)}
                disabled={!filterFaculty} // 学部が選ばれていないと選択不可
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium appearance-none disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">すべて</option>
                {availableDepartments && availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 趣味・タグ */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">趣味・タグ</label>
              <input
                type="text"
                placeholder="例: カフェ, プログラミング"
                value={filterHobby}
                onChange={e => setFilterHobby(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ユーザー一覧エリア */}
      <div className="max-w-md mx-auto px-4 space-y-5">
        <h2 className="text-sm font-bold text-gray-400 pl-2">おすすめのメンバー ({filteredUsers.length}人)</h2>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="text-4xl mb-4">😵</div>
            <p className="text-gray-500 font-medium text-sm">条件に合うユーザーが<br />見つかりませんでした</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800 tracking-tight gap-2 flex items-center">
                      {user.name} <span className="text-sm text-gray-400 font-medium">({user.age}歳)</span>
                    </h3>
                    <p className="text-xs text-teal-600 font-bold tracking-wide mt-1">
                      {user.faculty} {user.department}・{user.grade}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-5 leading-relaxed bg-gray-50 p-4 rounded-2xl">
                  {user.bio}
                </p>

                {/* タグの表示 */}
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 font-medium text-xs rounded-full shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="border-t border-gray-50 flex">
                <button className="flex-1 py-4 text-teal-600 font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
                  <span className="text-lg">👋</span>
                  話してみたい
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}