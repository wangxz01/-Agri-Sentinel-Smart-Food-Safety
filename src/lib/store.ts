import { kv } from "@vercel/kv";
import { promises as fs } from "fs";
import path from "path";

const useLocal =
  !process.env.VERCEL_KV_REST_API_URL && !process.env.KV_REST_API_URL;
const storeFile = path.join(process.cwd(), ".secburn-local-store.json");

async function readLocal() {
  try {
    const buf = await fs.readFile(storeFile);
    return JSON.parse(buf.toString()) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

async function writeLocal(data: Record<string, string>) {
  await fs.writeFile(storeFile, JSON.stringify(data));
}

export async function storeSet(key: string, value: string) {
  if (useLocal) {
    const data = await readLocal();
    data[key] = value;
    await writeLocal(data);
    return;
  }
  await kv.set(key, value);
}

export async function storeGetDel(key: string): Promise<string | null> {
  if (useLocal) {
    const data = await readLocal();
    const v = data[key] ?? null;
    if (v) {
      delete data[key];
      await writeLocal(data);
    }
    return v;
  }
  const anyKv: any = kv as any;
  if (typeof anyKv.getdel === "function") {
    return (await anyKv.getdel(key)) ?? null;
  }
  const v = await kv.get<string>(key);
  if (v) await kv.del(key);
  return v ?? null;
}