import { storeSet } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null as any);
  const message = body?.message as string | undefined;
  if (!message || typeof message !== "string" || !message.trim()) {
    return new Response("Invalid message", { status: 400 });
  }
  const id = crypto.randomUUID();
  await storeSet(`note:${id}`, message);
  return Response.json({ id });
}