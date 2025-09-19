import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import OpenAI from "openai";

try { admin.app(); } catch { admin.initializeApp(); }

/** Declare you use this secret, then read it via process.env */
export const jxpChat = onCall(
  { region: "us-central1", secrets: ["OPENAI_API_KEY"] },
  async (req) => {
    if (!req.auth) return { error: "unauthenticated" };

    const userMessage = String(req.data?.message ?? "").trim();
    if (!userMessage) return { error: "empty_message" };

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const resp = await openai.responses.create({
      model: "gpt-5-thinking",              // <- OpenAI GPT model
      messages: [
        { role: "system", content:
          "You are a warm, non-clinical support guide. No diagnosis or med advice. Keep it short; one question at a time."
        },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    const text =
      (resp as any).output_text ??
      (resp.output?.[0] as any)?.content?.[0]?.text ??
      "Sorry—no response.";

    return { text };
  }
);
