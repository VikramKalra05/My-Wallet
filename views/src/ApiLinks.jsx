// API base URL. Override with REACT_APP_API_URL (e.g. in views/.env.local)
// so local development doesn't read/write production data.
export const TESTING_URL =
  process.env.REACT_APP_API_URL ||
  "https://my-wallet-gamma-eight.vercel.app/api/v1";
