// functions/src/index.ts
// import "dotenv/config";
// import { onRequest } from "firebase-functions/v2/https";
// import OpenAI from "openai";

// export const jxpChatHttp = onRequest(
//   { region: "us-central1", cors: true, secrets: ["OPENAI_API_KEY"] },
//   async (req, res) => {
//     // No explicit return of res.* — just send and exit.

//     if (req.method !== "POST") {
//       res.status(405).json({ error: "Use POST" });
//       return;
//     }

//     const { message } = req.body ?? {};
//     if (typeof message !== "string" || !message.trim()) {
//       res.status(400).json({ error: "Missing 'message' string" });
//       return;
//     }

//     try {
//       const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//       const r = await openai.responses.create({
//         model: "gpt-5-thinking",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a warm, non-clinical support guide. No diagnosis or med advice. Use Reflect → Explore → Reframe → Plan → Check-in. One question at a time.",
//           },
//           { role: "user", content: message },
//         ],
//         temperature: 0.7,
//       });

//       const text =
//         (r as any).output_text ??
//         (r.output?.[0] as any)?.content?.[0]?.text ??
//         "Sorry—no response.";

//       res.status(200).json({ text });
//       // <-- no `return res.status(...)` here
//     } catch (e: any) {
//       res.status(500).json({ error: e?.message || "OpenAI error" });
//       // <-- no `return res.status(...)` here either
//     }
//   }
// );
