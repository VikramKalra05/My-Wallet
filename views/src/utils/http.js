// Shared fetch wrapper.
//
// The API answers 401 for a missing/expired token (server
// middleware/auth.middleware.js). The utils used to return `undefined`
// silently, so pages rendered empty states ("No accounts Found") instead of
// logging the user out. Route every API call through here so a dead session
// always bounces to /login (public pages are left alone).
const PUBLIC_PATHS = ["/", "/login", "/register", "/logout"];

export const handleUnauthorized = (res) => {
  if (!res || res.status !== 401) return false;

  if (!PUBLIC_PATHS.includes(window.location.pathname)) {
    window.location.assign("/login");
  }
  return true;
};

export const apiFetch = async (...args) => {
  const res = await fetch(...args);
  handleUnauthorized(res);
  return res;
};
