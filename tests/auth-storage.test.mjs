import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { clearStoredToken, getStoredToken, saveToken } from "../src/services/auth-storage.js";

const TOKEN_KEY = "midterm.accessToken";
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

function memoryStorage() {
  const items = new Map();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}

beforeEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: memoryStorage(), sessionStorage: memoryStorage() },
  });
});

afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", originalWindow);
  } else {
    delete globalThis.window;
  }
});

test("remembered tokens survive a new browser session", () => {
  saveToken("remembered-token", true);
  assert.equal(window.localStorage.getItem(TOKEN_KEY), "remembered-token");
  assert.equal(window.sessionStorage.getItem(TOKEN_KEY), null);
  window.sessionStorage = memoryStorage();
  assert.equal(getStoredToken(), "remembered-token");
});

test("unchecked remember-me keeps the login in session storage only", () => {
  saveToken("session-token", false);
  assert.equal(window.localStorage.getItem(TOKEN_KEY), null);
  assert.equal(getStoredToken(), "session-token");
  window.sessionStorage = memoryStorage();
  assert.equal(getStoredToken(), null);
});

test("a session-only login replaces a previously remembered account", () => {
  saveToken("old-account", true);
  saveToken("new-account", false);
  assert.equal(window.localStorage.getItem(TOKEN_KEY), null);
  assert.equal(getStoredToken(), "new-account");
});

test("remembering an account removes any previous session-only token", () => {
  saveToken("old-account", false);
  saveToken("new-account", true);
  assert.equal(window.sessionStorage.getItem(TOKEN_KEY), null);
  assert.equal(getStoredToken(), "new-account");
});

test("logout clears both storage locations", () => {
  window.localStorage.setItem(TOKEN_KEY, "remembered-token");
  window.sessionStorage.setItem(TOKEN_KEY, "session-token");
  clearStoredToken();
  assert.equal(window.localStorage.getItem(TOKEN_KEY), null);
  assert.equal(window.sessionStorage.getItem(TOKEN_KEY), null);
  assert.equal(getStoredToken(), null);
});

test("blocked local storage does not prevent reading or clearing a session token", () => {
  window.sessionStorage.setItem(TOKEN_KEY, "session-token");
  Object.defineProperty(window, "localStorage", {
    get() { throw new Error("Storage is blocked"); },
  });
  assert.equal(getStoredToken(), "session-token");
  clearStoredToken();
  assert.equal(getStoredToken(), null);
});

test("unavailable storage does not throw during login or logout", () => {
  for (const storageName of ["localStorage", "sessionStorage"]) {
    Object.defineProperty(window, storageName, {
      get() { throw new Error("Storage is blocked"); },
    });
  }
  assert.doesNotThrow(() => saveToken("token", true));
  assert.doesNotThrow(() => saveToken("token", false));
  assert.doesNotThrow(clearStoredToken);
  assert.equal(getStoredToken(), null);
});
