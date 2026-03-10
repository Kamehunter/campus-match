"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  // ① ポップアップが表示されているかどうかを管理する箱
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // ② ログアウトを実際に実行する関数
  const handleLogout = () => {
    // 本来はここでサーバー側のセッションを消したりする
    localStorage.removeItem("access_token");
    console.log("ログアウトしたで");
    router.push("/"); // トップページへ飛ばす
  };

  // 本来はバックエンド（友人）からデータを取ってくるけど、一旦「仮データ」を置くで
  const [user, setUser] = useState({
    name: "たなか",
    faculty: "工学部",
    department: "電子学科",
    studentId: "00A23000",
    email: "example@osaka-u.ac.jp",
    bio: "物理学徒です。量子力学とバイク（VTR250）が好きです",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // GET /profile/me が存在すると仮定してデータを取得
        const res = await fetch("https://campus-match-api.onrender.com/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({
            ...prev,
            name: data.nickname || prev.name,
            faculty: data.faculty || prev.faculty,
            department: data.department || prev.department,
            bio: data.bio || prev.bio,
            // 追加項目があれば適宜反映
          }));
        } else {
          console.error("プロフィール取得失敗", res.status);
        }
      } catch (err) {
        console.error("通信エラー", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダーエリア */}
      <div className="bg-teal-600 h-32 w-full relative overflow-hidden flex flex-col items-center justify-center pb-4">
         {/* 背景の装飾 */}
         <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
         <span className="text-[10px] font-bold text-teal-200 tracking-[0.3em] mb-1 relative z-10">OSAKA UNIVERSITY</span>
         <h1 className="text-2xl font-black text-white tracking-widest relative z-10">CAMPUS MATCH</h1>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16">
        {/* プロフィールカード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          {/* プロフィール画像（仮） */}
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto border-4 border-white shadow-sm flex items-center justify-center text-4xl overflow-hidden">
            👤
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-teal-600 font-medium">{user.faculty} {user.department}</p>
          <p className="text-gray-500 text-sm mt-1">学籍番号: {user.studentId}</p>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left">
            <p className="text-gray-700 leading-relaxed text-sm">
              {user.bio}
            </p>
          </div>

          <Link
            href="/mypage/edit-prof"
            className="mt-6 block w-full border-2 border-teal-600 text-teal-600 py-2 rounded-xl font-bold hover:bg-teal-50 transition"
          >
            プロフィールを編集
          </Link>
        </div>

        {/* メニューリスト */}
        <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <span className="text-gray-700">登録情報の変更</span>
            <span className="text-gray-400">＞</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <span className="text-gray-700">各種設定</span>
            <span className="text-gray-400">＞</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <span className="text-gray-700">お知らせ</span>
            <span className="text-gray-400">＞</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <span className="text-gray-700">利用規約</span>
            <span className="text-gray-400">＞</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <span className="text-gray-700">問い合わせ</span>
            <span className="text-gray-400">＞</span>
          </button>

          <Link
            href="/mypage/delete-account" // さっき作った退会ページのパスを指定
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <span className="text-gray-700">退会</span>
            <span className="text-gray-400">＞</span>
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)} // ③ クリックでモーダルを表示
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-red-500 font-medium"
          >
            <span>ログアウト</span>
          </button>


        </div>
      </div>

      {/* ④ ログアウト確認ポップアップ（モーダル） */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">ログアウトしますか？</h2>
            <p className="text-gray-600 mb-6">
              ログイン画面に戻るけど、ええかな？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)} // キャンセル
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                やめる
              </button>
              <button
                onClick={handleLogout} // 実行
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}