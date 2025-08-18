export default function Blog() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">关于我们</h1>
        <p className="text-lg">
          这是一个分享、记录和学习Web技术的个人博客。我们致力于提供高质量的内容，帮助开发者提升技能。
        </p>
      </main>

    </div>
  );
}