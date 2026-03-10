"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Sparkles, UserCircle2, Hash, X } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState("");
  const [club, setClub] = useState("");
  const [freeTimes, setFreeTimes] = useState<string[]>([]);
  
  const timeSlots = [
    { id: "mon_1", label: "月1" }, { id: "tue_1", label: "火1" }, { id: "wed_1", label: "水1" }, { id: "thu_1", label: "木1" }, { id: "fri_1", label: "金1" },
    { id: "mon_2", label: "月2" }, { id: "tue_2", label: "火2" }, { id: "wed_2", label: "水2" }, { id: "thu_2", label: "木2" }, { id: "fri_2", label: "金2" },
    { id: "mon_3", label: "月3" }, { id: "tue_3", label: "火3" }, { id: "wed_3", label: "水3" }, { id: "thu_3", label: "木3" }, { id: "fri_3", label: "金3" },
    { id: "mon_4", label: "月4" }, { id: "tue_4", label: "火4" }, { id: "wed_4", label: "水4" }, { id: "thu_4", label: "木4" }, { id: "fri_4", label: "金4" },
    { id: "mon_5", label: "月5" }, { id: "tue_5", label: "火5" }, { id: "wed_5", label: "水5" }, { id: "thu_5", label: "木5" }, { id: "fri_5", label: "金5" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(currentTag.trim()) && tags.length < 5) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleFreeTime = (slotId: string) => {
    if (freeTimes.includes(slotId)) {
      setFreeTimes(freeTimes.filter(id => id !== slotId));
    } else {
      setFreeTimes([...freeTimes, slotId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("ログイン情報が見つかりません。もう一度ログインしてください。");
        router.push("/login");
        return;
      }

      // 1. プロフィールデータ（JSON）の送信
      const freeSlotsLabels = freeTimes.map(id => timeSlots.find(t => t.id === id)?.label).filter(Boolean);
      
      const profileData = {
        nickname: nickname,
        bio: bio,
        habit: tags,
        circles: club,
        free_slots: freeSlotsLabels
      };

      const setupRes = await fetch("https://campus-match-api.onrender.com/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!setupRes.ok) {
        throw new Error("プロフィールの保存に失敗しました。");
      }

      // 2. プロフィール画像がある場合はアップロード
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("file", profileImageFile);

        const avatarRes = await fetch("https://campus-match-api.onrender.com/profile/upload-avatar", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        if (!avatarRes.ok) {
          console.error("画像アップロード失敗:", avatarRes.status);
          // 画像アップロードに失敗しても、プロフィールは保存されているので進める
        }
      }

      console.log("プロフィールデータ:", profileData);
      alert("プロフィールを保存しました！\nトップページへ移動します。");
      router.push("/matching");
    } catch (err) {
      console.error("通信エラー", err);
      alert("エラーが発生しました。");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100 my-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 tracking-tight">
            <Sparkles className="text-yellow-500" size={24} />
            プロフィールを作成
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            他の学生にあなたのことをもっと知ってもらいましょう！
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* プロフィール画像 */}
          <div className="flex flex-col items-center justify-center">
            <label className="relative cursor-pointer group">
              <div className="w-28 h-28 rounded-full border-4 border-gray-50 bg-gray-100 shadow-sm overflow-hidden flex items-center justify-center transition-all group-hover:border-teal-100 group-hover:shadow-md">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 size={64} className="text-gray-300" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-teal-600 w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-sm text-white transition-transform group-hover:scale-110">
                <Camera size={14} />
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
            <span className="text-xs font-bold text-gray-400 mt-3">タップして写真を変更</span>
          </div>

          {/* ニックネーム */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">ニックネーム (アプリ内で表示)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
              placeholder="例: コジコジ"
              required
            />
          </div>

          {/* ひとこと・自己紹介 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">ひとこと・自己紹介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm resize-none"
              placeholder="例: 一緒にランチに行ける友達を探してます！"
            />
          </div>

          {/* 趣味・タグ機能 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
              趣味や興味のあること（最大5つまで）
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={16} className="text-teal-500" />
              </div>
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={tags.length >= 5}
                className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm disabled:opacity-50"
                placeholder="入力してEnterを押す (例: カフェ巡り)"
              />
            </div>

            {/* 追加されたタグの表示エリア */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100"
                  >
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-teal-400 hover:text-teal-600 hover:bg-teal-100 rounded-full p-0.5 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {tags.length === 5 && (
              <p className="text-xs text-orange-500 font-bold mt-2 ml-1">※最大5つまで追加できます</p>
            )}
          </div>

          {/* 部活・サークル */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">所属している部活・サークル</label>
            <input
              type="text"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
              placeholder="例: テニスサークル、軽音楽部"
            />
          </div>

          {/* 空きコマ */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">
              空きコマ（一緒にランチ・お茶に行ける時間）
            </label>
            <div className="grid grid-cols-5 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = freeTimes.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleFreeTime(slot.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-teal-500 text-white shadow-sm scale-105"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 ml-1 text-center font-medium">
              タップして選択・解除ができます
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white p-4 rounded-2xl font-bold hover:from-teal-600 hover:to-teal-800 transition-all transform hover:scale-[1.02] shadow-md shadow-teal-500/30"
            >
              プロフィールを保存する
            </button>

            <div className="text-center">
              <Link 
                href="/"
                className="inline-block text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors py-2"
              >
                スキップしてあとで設定する
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
