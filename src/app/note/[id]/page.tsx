import { storeGetDel } from "@/lib/store";

type Params = { id: string };

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const key = `note:${id}`;
  const message = await storeGetDel(key);

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-900 shadow-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-3">此便签已被销毁，或链接无效。</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-900 shadow-sm">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-3">便签内容</h2>
        <pre className="whitespace-pre-wrap break-words rounded-xl border border-black/10 dark:border-white/20 p-4 bg-background text-foreground">{message}</pre>
      </div>
    </div>
  );
}