import Navbar from "../../components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* 2. ここに Navbar を配置！ */}
      <Navbar />

      {/* 3. コンテンツが Navbar と重ならへんように余白（Padding）を入れる */}
      <main className="pb-16 md:pb-0 md:pl-64 min-h-screen">
        {children}
      </main>
    </>
  );
}
