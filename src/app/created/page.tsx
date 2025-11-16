"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CreatedPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);
  const shareUrl = useMemo(() => {
    return id ? `${origin || ""}/note/${id}` : "";
  }, [origin, id]);

  async function copy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-900 shadow-sm">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-3">链接已生成！请注意：它只能被查看一次。</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl h-11 px-3 border border-black/10 dark:border-white/20 bg-background text-foreground"
            readOnly
            value={shareUrl}
            placeholder="生成中..."
          />
          <button
            className="rounded-xl h-11 px-4 bg-foreground text-background"
            onClick={copy}
            disabled={!shareUrl}
          >
            复制链接
          </button>
        </div>
      </div>
    </div>
  );
}