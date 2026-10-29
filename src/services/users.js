const AUTH_URL = "https://dummyjson.com/auth";

export async function loginUser(username, password, rememberMe = false) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: rememberMe ? 7 * 24 * 60 : 30,
    }),
  });

  if (response.status === 400 || response.status === 401) {
    throw new Error("Invalid username or password.");
  }

  if (!response.ok) {
    throw new Error("Unable to sign in right now. Please try again later.");
  }

  const data = await response.json();
  if (typeof data.accessToken !== "string" || !data.accessToken) {
    throw new Error("Unable to sign in right now. Please try again later.");
  }

  return data.accessToken;
}

export async function fetchUser(accessToken, { signal } = {}) {
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal,
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Your session has expired. Please log in again.");
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Unable to load your profile. Please try again later.");
  }

  return response.json();
}
