"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileImage, ArrowLeft, CheckCircle2 } from "lucide-react";

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

// 阪大の研究科データ（代表的なもの）
const osakaUGraduateSchools = [
  "人文学研究科",
  "人間科学研究科",
  "法学研究科",
  "経済学研究科",
  "理学研究科",
  "医学系研究科",
  "歯学研究科",
  "薬学研究科",
  "工学研究科",
  "基礎工学研究科",
  "国際公共政策研究科",
  "情報科学研究科",
  "生命機能研究科",
  "高等司法研究科",
];

export default function SignupPage() {
  const router = useRouter();
  // ① ステップと状態の管理
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentType, setStudentType] = useState<"undergraduate" | "graduate">("undergraduate"); // 学部生 or 大学院生
  const [faculty, setFaculty] = useState(""); // 学部
  const [department, setDepartment] = useState(""); // 学科
  const [graduateSchool, setGraduateSchool] = useState(""); // 研究科
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [studentIdImage, setStudentIdImage] = useState<string | null>(null);

  // 選択された学部の学科一覧を取得
  const availableDepartments = faculty ? osakaUFaculties[faculty] : [];

  // ステップ1からステップ2に進む処理
  const handleNextStep = () => {
    // 学籍番号のパターンを定義（正規表現）
    const studentIdPattern = /^\d{2}[A-Z]\d{5}$/;

    if (!studentIdPattern.test(studentId)) {
      alert("学籍番号の形式がちがうで！ (例: 00A23000)");
      return;
    }

    // 問題なければステップ2（画像アップロード）へ
    setStep(2);
  };

  // 画像アップロードの疑似処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // プレビュー用にローカルURLを作成（実際のアプリではサーバーに送る部分）
      const imageUrl = URL.createObjectURL(file);
      setStudentIdImage(imageUrl);
    }
  };

  // 最終的な登録処理
  const handleFinalSubmit = async () => {
    if (!studentIdImage) {
      alert("学生証の画像をアップロードしてや！");
      return;
    }

    try {
      const is_graduate = studentType === "graduate";
      // API仕様書に合わせてプロパティをマッピング
      // API: department -> 学部, major -> 学科/研究科
      const signupPayload = {
        email: email,
        password: password,
        birthday: birthdate,
        gender: gender || "other",
        is_graduate: is_graduate,
        department: is_graduate ? "" : faculty,
        major: is_graduate ? graduateSchool : department,
        student_id: studentId,
        phone: phoneNumber,
        agreed_to_terms: true
      };

      const res = await fetch("https://campus-match-api.onrender.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupPayload)
      });

      if (res.ok) {
        console.log("最終登録データ:", signupPayload);
        
        // 登録後にそのまま自動でログインを試み、トークンを取得する
        try {
          const loginRes = await fetch("https://campus-match-api.onrender.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            localStorage.setItem("access_token", loginData.access_token);
            localStorage.setItem("user_id", loginData.user_id);
          }
        } catch (e) {
          console.error("自動ログイン失敗", e);
        }

        // 今回のAPIでは学生証画像のアップロード先が明記されていないため、
        // 登録が通ったらそのまま成功画面（審査中）へ遷移する
        router.push("/signup/success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("サインアップエラー:", res.status, errorData);
        alert("登録に失敗しました。入力内容を確認してください。");
      }
    } catch (err) {
      console.error("通信エラー:", err);
      alert("通信エラーが発生しました。");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100 my-8 relative overflow-hidden">
        {/* アクセントライン */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>

        {/* ヘッダー部分。ステップ表示 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                title="戻る"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-teal-600 text-center flex-1 pr-10">
              {step === 1 ? "新規アカウント登録" : "学生証のアップロード"}
            </h1>
          </div>

          {/* プログレスバー */}
          <div className="flex justify-center items-center gap-2 mb-2 px-10">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-teal-500" : "bg-gray-200"}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-teal-500" : "bg-gray-200"}`}></div>
          </div>
          <div className="flex justify-between px-6 text-xs font-bold text-gray-400">
            <span className={step >= 1 ? "text-teal-600" : ""}>基本情報</span>
            <span className={step >= 2 ? "text-teal-600" : ""}>本人確認</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* メール・パスワード */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
                placeholder="example@osaka-u.ac.jp"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm"
              />
            </div>

            {/* 生年月日・性別 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">生年月日</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">性別</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm appearance-none"
                >
                  <option value="">選択してください</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                  <option value="prefer_not_to_say">回答しない</option>
                </select>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* 大学情報 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">所属</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setStudentType("undergraduate"); }}
                    className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      studentType === "undergraduate" 
                        ? "bg-teal-600 text-white shadow-sm" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    学部生
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setStudentType("graduate"); }}
                    className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      studentType === "graduate" 
                        ? "bg-teal-600 text-white shadow-sm" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    大学院生
                  </button>
                </div>
              </div>

              {studentType === "undergraduate" ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学部</label>
                    <select
                      value={faculty}
                      onChange={(e) => {
                        setFaculty(e.target.value);
                        setDepartment(""); // 学部が変わったら学科をリセット
                      }}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm appearance-none"
                    >
                      <option value="">選択してください</option>
                      {Object.keys(osakaUFaculties).map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学科</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={!faculty} // 学部が選ばれていないと選択できない
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm appearance-none disabled:opacity-50 disabled:bg-gray-100"
                    >
                      <option value="">選択してください</option>
                      {availableDepartments?.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">研究科</label>
                  <select
                    value={graduateSchool}
                    onChange={(e) => setGraduateSchool(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 font-medium text-sm appearance-none"
                  >
                    <option value="">選択してください</option>
                    {osakaUGraduateSchools.map((school) => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">学籍番号</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
                placeholder="123456X"
              />

            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">電話番号</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
                placeholder="090-1234-5678"
              />
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-teal-600 text-white p-4 rounded-2xl font-bold hover:bg-teal-700 transition-all mt-8 transform hover:scale-[1.02] shadow-sm flex justify-center items-center gap-2"
            >
              次へ進む
            </button>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500 font-medium">
                すでにアカウントを持ってる？{" "}
                <Link href="/login" className="text-teal-600 font-bold hover:underline">
                  ログインはこちら
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 py-4">
            <div className="bg-teal-50 rounded-2xl p-4 text-sm text-teal-800 font-medium leading-relaxed">
              安心・安全なコミュニティを維持するため、阪大生であることを確認させてください。<br />
              <span className="font-bold text-teal-600">※アップロードされた画像は本人確認後、即座に破棄されます。</span>
            </div>

            <div className="w-full">
              <p className="block text-xs font-bold text-gray-500 mb-2 ml-1">学生証の画像をアップロード</p>

              {/* アップロードエリア */}
              <label className={`
                flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all
                ${studentIdImage ? 'border-teal-400 bg-teal-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
              `}>
                {studentIdImage ? (
                  <div className="flex flex-col items-center p-4">
                    <CheckCircle2 size={48} className="text-teal-500 mb-2" />
                    <span className="text-teal-700 font-bold">画像が選択されました</span>
                    <span className="text-xs text-teal-600/70 mt-1">タップして選び直す</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 text-gray-500">
                    <Upload size={40} className="mb-3 text-gray-400" />
                    <p className="text-sm font-bold text-gray-600 mb-1">
                      タップしてファイルをアップロード
                    </p>
                    <p className="text-xs text-gray-400">
                      JPEG, PNG, HEIC形式（最大10MB）
                    </p>
                  </div>
                )}

                {/* 隠しinput */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mt-4">
              <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-2">
                <FileImage size={14} className="text-teal-600" />
                こんな画像がNGやで！（注意点）
              </h3>
              <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4 marker:text-gray-400 font-medium">
                <li>顔写真や氏名、学籍番号がぼやけている、反射して見えない</li>
                <li>学生証の一部が指で隠れている</li>
                <li>有効期限切れの学生証</li>
              </ul>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={!studentIdImage}
              className={`w-full p-4 flex justify-center items-center gap-2 rounded-2xl font-bold transition-all mt-4 transform hover:scale-[1.02] shadow-sm
                ${studentIdImage
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed transform-none shadow-none'}
              `}
            >
              登録を申請する！
            </button>
          </div>
        )}
      </div>
    </main>
  );
}