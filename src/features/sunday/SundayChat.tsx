import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

type Req = { message: string };
type Res = { text?: string; error?: string };

export async function SundayChat(message: string): Promise<string> {
  const call = httpsCallable<Req, Res>(functions, "jxpChat");
  const res = await call({ message });
  if (res.data?.error) throw new Error(res.data.error);
  return res.data?.text ?? "";
}
