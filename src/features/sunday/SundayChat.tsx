import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export async function SundayChat(message: string) {
  const fn = httpsCallable<
    { message: string },
    { text?: string; error?: string }
  >(functions, "jxpChat");
  const res = await fn({ message });
  if (res.data.error) throw new Error(res.data.error);
  return res.data.text ?? "";
}
