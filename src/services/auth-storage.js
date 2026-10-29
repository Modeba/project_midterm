const TOKEN_KEY = "midterm.accessToken";
const STORAGE_NAMES = ["localStorage", "sessionStorage"];

export function getStoredToken() {
  for (const storageName of STORAGE_NAMES) {
    try {
      const token = window[storageName].getItem(TOKEN_KEY);
      if (token) return token;
    } catch {
      // One storage location may be unavailable while the other still works.
    }
  }
  return null;
}

export function clearStoredToken() {
  for (const storageName of STORAGE_NAMES) {
    try {
      window[storageName].removeItem(TOKEN_KEY);
    } catch {
      // Always try clearing the other storage location as well.
    }
  }
}

export function saveToken(token, rememberMe = false) {
  clearStoredToken();
  try {
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  } catch {
    // The current login still works when browser storage is unavailable.
  }
}
