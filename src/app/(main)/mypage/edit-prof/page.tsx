"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
    const router = useRouter();

    // 初期値は本来DBやコンテキストから取得しますが、仮置きしておきます
    const [formData, setFormData] = useState({
        name: "たなか",
        faculty: "基礎工学部",
        department: "電子物理科学科",
        bio: "物理学徒です。量子力学とバイク（VTR250）が好きです",
    });

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
                    setFormData(prev => ({
                        ...prev,
                        name: data.nickname || prev.name,
                        faculty: data.faculty || prev.faculty,
                        department: data.department || prev.department,
                        bio: data.bio || prev.bio,
                    }));
                }
            } catch (err) {
                console.error("プロフィール取得エラー", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch("https://campus-match-api.onrender.com/profile/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    nickname: formData.name,
                    bio: formData.bio,
                    // 学部学科の更新がサポートされている場合はここに追加
                })
            });
            if (res.ok) {
                console.log("保存したデータ:", formData);
                router.push("/mypage");
            } else {
                console.error("保存失敗", res.status);
            }
        } catch (err) {
            console.error("通信エラー", err);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* ヘッダーエリア */}
            <div className="bg-teal-600 px-4 py-4 flex items-center justify-between shadow-md sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:bg-teal-700 px-3 py-1 rounded-full transition text-sm font-medium"
                >
                    ← 戻る
                </button>
                <h1 className="text-white font-bold text-lg">プロフィールの編集</h1>
                <div className="w-16"></div> {/* 戻るボタンの幅に合わせてバランスをとるためのダミー */}
            </div>

            <div className="max-w-md mx-auto px-4 mt-6">
                <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

                    {/* プロフィール画像変更（仮） */}
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 bg-gray-200 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-4xl overflow-hidden mb-3 relative group cursor-pointer">
                            👤
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-bold">変更</span>
                            </div>
                        </div>
                        <p className="text-sm text-teal-600 font-bold cursor-pointer hover:underline">画像を変更する</p>
                    </div>

                    <div className="space-y-5">
                        {/* 名前 */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">表示名</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-gray-800 font-medium"
                                placeholder="名前を入力"
                            />
                        </div>

                        {/* 学部 */}
                        <div>
                            <label htmlFor="faculty" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">学部</label>
                            <input
                                type="text"
                                id="faculty"
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-gray-800"
                                placeholder="学部を入力"
                            />
                        </div>

                        {/* 学科 */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">学科</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-gray-800"
                                placeholder="学科を入力"
                            />
                        </div>

                        {/* 自己紹介 */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">自己紹介</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none text-gray-800 leading-relaxed"
                                placeholder="自己紹介を入力"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-200 text-lg"
                        >
                            保存する
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
