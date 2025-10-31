// import { Request, Response, NextFunction } from "express";
// import { adminAuth } from "../lib/firebaseAdmin";
// export interface AuthenticatedRequest extends Request {
//   uid?: string;
//   token?: any;
// }

// export const authMiddleware = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Try Authorization header first (ID token)
//     const authHeader = req.headers.authorization;
//     if (
//       authHeader &&
//       typeof authHeader === "string" &&
//       authHeader.startsWith("Bearer ")
//     ) {
//       const idToken = authHeader.split("Bearer ")[1];
//       const decoded = await adminAuth.verifyIdToken(idToken);
//       req.uid = decoded.uid;
//       req.token = decoded;
//       return next();
//     }

//     // If no header, try the __session cookie (session cookie created by createSessionCookie)
//     const sessionCookie = req.cookies && req.cookies.__session;
//     if (sessionCookie) {
//       // verifySessionCookie returns decoded claims similar to verifyIdToken
//       const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
//       req.uid = decoded.uid;
//       req.token = decoded;
//       return next();
//     }

//     return res
//       .status(401)
//       .json({ error: "No ID token or session cookie provided" });
//   } catch (err) {
//     console.error("authMiddleware error:", err);
//     return res.status(401).json({ error: "Invalid or expired ID token" });
//   }
// };
