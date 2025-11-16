"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const data = await res.json();
      router.push(`/created?id=${data.id}`);
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-900 shadow-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">创建即焚便签</h1>
        <textarea
          className="w-full h-48 p-4 rounded-xl border border-black/10 dark:border-white/20 bg-background text-foreground outline-none"
          placeholder="在此粘贴你的敏感信息..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-4 w-full rounded-xl h-11 bg-foreground text-background font-medium disabled:opacity-60"
          disabled={loading || !message.trim()}
          onClick={handleCreate}
        >
          {loading ? "生成中..." : "生成链接"}
        </button>
      </div>
    </div>
  );
}
