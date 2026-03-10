"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, MessageCircle, User, Star } from "lucide-react"; // アイコンライブラリ

export default function Navbar() {
    const pathname = usePathname();

    // メニュー項目の定義
    const menuItems = [
        { name: "さがす", href: "/matching", icon: Search },
        { name: "趣味", href: "/hobby", icon: Star },
        { name: "いいね", href: "/liked", icon: Heart },
        { name: "チャット", href: "/chat", icon: MessageCircle },
        { name: "マイページ", href: "/mypage", icon: User },
    ];

    return (
        <nav className="
      /* スマホ：画面下に横並び */
      fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-100 flex flex-row justify-around items-center z-50
      /* PC：画面左に縦並び（768px以上） */
      md:top-0 md:left-0 md:w-64 md:h-full md:flex-col md:justify-start md:pt-10 md:px-4 md:border-t-0 md:border-r
    ">
            {/* PC時のみ表示するロゴ */}
            <div className="hidden md:block mb-10 px-4">
                <div className="text-[10px] font-bold text-gray-400 tracking-widest mb-1">OSAKA UNIVERSITY</div>
                <h1 className="text-xl font-black text-teal-600 tracking-tight">CAMPUS MATCH</h1>
            </div>

            <div className="flex flex-row w-full justify-around md:flex-col md:gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex flex-col items-center justify-center gap-1 w-full py-2 rounded-xl transition-all
                md:flex-row md:justify-start md:px-4 md:py-3 md:gap-4
                ${isActive ? "text-teal-600 bg-teal-50" : "text-gray-400 hover:text-teal-500 hover:bg-gray-50"}
              `}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold md:text-base md:font-medium">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}