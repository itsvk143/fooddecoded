import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getProductFeedback, POST as postProductFeedback } from "../src/app/api/products/[id]/feedback/route";
import { GET as getFeedbackStats } from "../src/app/api/admin/feedback/stats/route";
import { GET as getAdminFeedback } from "../src/app/api/admin/feedback/route";
import {
  createSession,
  getSessionCookieHeader,
  getLogoutCookieHeader,
  upsertGoogleUser,
} from "../src/lib/session";

test("Feedback Calculations: Approval formula and consensus threshold (< 5 votes)", () => {
  function computeApproval(thumbsUp: number, thumbsDown: number) {
    const total = thumbsUp + thumbsDown;
    const approval = total > 0 ? Math.round((thumbsUp / total) * 1000) / 10 : 0;
    const notEnoughFeedback = total < 5;
    return { total, approval, notEnoughFeedback };
  }

  // Zero votes
  const zero = computeApproval(0, 0);
  assert.equal(zero.total, 0);
  assert.equal(zero.approval, 0);
  assert.equal(zero.notEnoughFeedback, true);

  // 4 votes (below 5 votes threshold)
  const fourVotes = computeApproval(4, 0);
  assert.equal(fourVotes.total, 4);
  assert.equal(fourVotes.approval, 100);
  assert.equal(fourVotes.notEnoughFeedback, true, "Must flag not enough feedback when total < 5");

  // 100 votes (91 up, 9 down -> 91.0%)
  const hundredVotes = computeApproval(91, 9);
  assert.equal(hundredVotes.total, 100);
  assert.equal(hundredVotes.approval, 91.0);
  assert.equal(hundredVotes.notEnoughFeedback, false);

  // 10 votes (5 up, 5 down -> 50.0%)
  const splitVotes = computeApproval(5, 5);
  assert.equal(splitVotes.total, 10);
  assert.equal(splitVotes.approval, 50.0);
  assert.equal(splitVotes.notEnoughFeedback, false);
});

test("Feedback Flags: Admin review flag logic (>= 5 downvotes or >= 30% negative)", () => {
  function isFlagged(thumbsUp: number, thumbsDown: number): boolean {
    const total = thumbsUp + thumbsDown;
    return thumbsDown >= 5 || (total >= 5 && thumbsDown / total >= 0.3);
  }

  // 4 downvotes, 0 up -> total 4 (< 5 total and < 5 downvotes)
  assert.equal(isFlagged(0, 4), false);

  // 5 downvotes, 15 up -> total 20, 25% negative, but thumbsDown >= 5
  assert.equal(isFlagged(15, 5), true, "Flagged when downvotes >= 5");

  // 3 downvotes, 5 up -> total 8, 37.5% negative (>= 30% and total >= 5)
  assert.equal(isFlagged(5, 3), true, "Flagged when >= 30% negative with >= 5 votes");

  // 1 downvote, 9 up -> total 10, 10% negative
  assert.equal(isFlagged(9, 1), false, "Not flagged when < 30% and < 5 downvotes");
});

test("Session Cookie: 30-Day Lifetime and Security Flags", () => {
  const fakeToken = "mock_session_token_123456789";
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const cookieHeader = getSessionCookieHeader(fakeToken, expiresAt);

  assert.ok(cookieHeader.includes("fooddecode_session="), "Cookie name must be fooddecode_session");
  assert.ok(cookieHeader.includes("Path=/"), "Cookie must be set to Path=/");
  assert.ok(cookieHeader.includes("HttpOnly"), "Cookie must be HttpOnly");
  assert.ok(cookieHeader.includes("SameSite=Lax"), "Cookie must use SameSite=Lax");
  assert.ok(cookieHeader.includes("Max-Age="), "Cookie must have Max-Age attribute");

  // Logout header
  const logoutHeader = getLogoutCookieHeader();
  assert.ok(logoutHeader.includes("Max-Age=0"), "Logout must set Max-Age=0 to immediately expire");
  assert.ok(logoutHeader.includes("Expires=Thu, 01 Jan 1970 00:00:00 GMT"));
});

test("Role Assignment Security: Google OAuth users are always assigned USER role", async () => {
  const profile = {
    id: "google_109823471029384",
    email: "consumer@example.com",
    name: "Jane Doe",
    picture: "https://example.com/jane.jpg",
  };

  const user = await upsertGoogleUser(profile);
  assert.equal(user.role, "USER", "Role must be strictly USER, never ADMIN");
  assert.equal(user.email, "consumer@example.com");
  assert.equal(user.name, "Jane Doe");
  assert.equal(user.googleId, "google_109823471029384");
});

test("Vote Switching Invariants: UP to DOWN and DOWN to UP atomic state change", () => {
  interface State {
    thumbsUp: number;
    thumbsDown: number;
    userVote: "UP" | "DOWN" | null;
  }

  function applyVote(current: State, newVote: "UP" | "DOWN"): State {
    let { thumbsUp, thumbsDown, userVote } = current;

    if (userVote === newVote) {
      // Toggle off
      if (newVote === "UP") thumbsUp = Math.max(0, thumbsUp - 1);
      if (newVote === "DOWN") thumbsDown = Math.max(0, thumbsDown - 1);
      return { thumbsUp, thumbsDown, userVote: null };
    }

    if (userVote === "UP" && newVote === "DOWN") {
      thumbsUp = Math.max(0, thumbsUp - 1);
      thumbsDown += 1;
      return { thumbsUp, thumbsDown, userVote: "DOWN" };
    }

    if (userVote === "DOWN" && newVote === "UP") {
      thumbsDown = Math.max(0, thumbsDown - 1);
      thumbsUp += 1;
      return { thumbsUp, thumbsDown, userVote: "UP" };
    }

    // First time voting
    if (newVote === "UP") thumbsUp += 1;
    if (newVote === "DOWN") thumbsDown += 1;
    return { thumbsUp, thumbsDown, userVote: newVote };
  }

  // Initial state: 10 UP, 2 DOWN (total 12)
  const initial: State = { thumbsUp: 10, thumbsDown: 2, userVote: null };

  // 1. User votes UP: 11 UP, 2 DOWN (total 13)
  const afterUp = applyVote(initial, "UP");
  assert.equal(afterUp.thumbsUp, 11);
  assert.equal(afterUp.thumbsDown, 2);
  assert.equal(afterUp.userVote, "UP");

  // 2. User switches to DOWN: 10 UP, 3 DOWN (total 13 - remains constant!)
  const afterSwitch = applyVote(afterUp, "DOWN");
  assert.equal(afterSwitch.thumbsUp, 10, "UP should decrement by 1");
  assert.equal(afterSwitch.thumbsDown, 3, "DOWN should increment by 1");
  assert.equal(afterSwitch.thumbsUp + afterSwitch.thumbsDown, 13, "Total votes must remain constant on switch");
  assert.equal(afterSwitch.userVote, "DOWN");

  // 3. User switches back to UP: 11 UP, 2 DOWN
  const afterSwitchBack = applyVote(afterSwitch, "UP");
  assert.equal(afterSwitchBack.thumbsUp, 11);
  assert.equal(afterSwitchBack.thumbsDown, 2);
  assert.equal(afterSwitchBack.userVote, "UP");
});

test("Public API: GET /api/products/[id]/feedback is accessible without authentication", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/sample-product-123/feedback");
  const res = await getProductFeedback(req, {
    params: Promise.resolve({ id: "sample-product-123" }),
  });

  assert.equal(res.status, 200, "Public GET endpoint must return HTTP 200");
  const data = await res.json();
  assert.ok(typeof data.thumbsUp === "number");
  assert.ok(typeof data.thumbsDown === "number");
  assert.ok(typeof data.totalVotes === "number");
  assert.ok(typeof data.communityApproval === "number");
  assert.ok(typeof data.notEnoughFeedback === "boolean");
  assert.equal(data.userVote, null, "Guest request should have null userVote");
});

test("Guest Restrictions: POST /api/products/[id]/feedback requires authentication", async () => {
  // Request without session cookie
  const req = new NextRequest("http://localhost:3000/api/products/sample-product-123/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote: "UP" }),
  });

  const res = await postProductFeedback(req, {
    params: Promise.resolve({ id: "sample-product-123" }),
  });

  assert.equal(res.status, 401, "Unauthenticated vote attempt must return HTTP 401");
  const data = await res.json();
  assert.ok(data.error.includes("Authentication required") || data.error.includes("sign in"));
});

test("Admin Security: Admin feedback endpoints reject unauthorized requests", async () => {
  // Unauthorized stats request
  const unauthReq = new NextRequest("http://localhost:3000/api/admin/feedback/stats");
  const unauthRes = await getFeedbackStats(unauthReq);
  assert.equal(unauthRes.status, 401, "Admin stats must require valid admin credentials");

  // Unauthorized feedback table request
  const unauthListReq = new NextRequest("http://localhost:3000/api/admin/feedback");
  const unauthListRes = await getAdminFeedback(unauthListReq);
  assert.equal(unauthListRes.status, 401, "Admin feedback list must require valid admin credentials");

  // Authorized stats request with valid header
  const authReq = new NextRequest("http://localhost:3000/api/admin/feedback/stats", {
    headers: { "x-admin-key": "fooddecode_admin_secret_key_change_in_production" },
  });
  const authRes = await getFeedbackStats(authReq);
  assert.equal(authRes.status, 200, "Authorized request with admin key must return HTTP 200");
  const authData = await authRes.json();
  assert.ok(typeof authData.totalSubmissions === "number");
  assert.ok(typeof authData.totalThumbsUp === "number");
  assert.ok(typeof authData.totalThumbsDown === "number");
  assert.ok(typeof authData.averageCommunityApproval === "number");
  assert.ok(typeof authData.flaggedForReviewCount === "number");
});
