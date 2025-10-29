import express from "express";
import request from "supertest";

// Create mocks for adminAuth and adminDb before importing the router
const mockVerifyIdToken = jest.fn().mockResolvedValue({ uid: "test-uid" });
const mockGetUser = jest
  .fn()
  .mockResolvedValue({
    uid: "test-uid",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
  });
const mockCreateSessionCookie = jest
  .fn()
  .mockResolvedValue("session-cookie-abc");
const mockVerifySessionCookie = jest
  .fn()
  .mockResolvedValue({ uid: "test-uid" });

const mockUserDocGet = jest.fn().mockResolvedValue({ exists: false });
const mockUserDocSet = jest.fn().mockResolvedValue(undefined);

const mockAdminAuth = {
  verifyIdToken: mockVerifyIdToken,
  getUser: mockGetUser,
  createSessionCookie: mockCreateSessionCookie,
  verifySessionCookie: mockVerifySessionCookie,
};

const mockAdminDb = {
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: mockUserDocGet,
      set: mockUserDocSet,
    }),
  }),
};

jest.mock("../lib/firebaseAdmin", () => ({
  adminAuth: mockAdminAuth,
  adminDb: mockAdminDb,
}));

// Now import the router (after mocking)
import sessionRouter from "../routes/session";

describe("POST /session/init", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/", sessionRouter);
  });

  it("creates a new user when none exists and returns sanitized user", async () => {
    const res = await request(app)
      .post("/session/init")
      .set("Authorization", "Bearer faketoken")
      .send();

    expect(res.status).toBe(200);
    expect(res.body.uid).toBe("test-uid");
    expect(mockVerifyIdToken).toHaveBeenCalledWith("faketoken");
    expect(mockUserDocSet).toHaveBeenCalled();
  });
});
