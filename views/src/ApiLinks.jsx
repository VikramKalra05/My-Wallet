// API base URL.
//
// Production uses the same-origin /api proxy (see vercel.json) so the auth
// cookie is first-party — a cross-origin cookie is a third-party cookie, and
// Brave/Chrome block those by sign-in loops.
// Local dev still points at the deployed API (override with REACT_APP_API_URL).
export const TESTING_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api/v1"
    : "https://my-wallet-gamma-eight.vercel.app/api/v1");
