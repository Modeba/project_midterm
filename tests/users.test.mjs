import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { fetchUser, loginUser, registerUser } from "../src/services/users.js";

afterEach(() => mock.restoreAll());

const registration = {
  firstName: "Test", lastName: "User", username: "testuser",
  email: "test@example.com", password: "test-password",
};

test("registration posts only account fields and drops the echoed password", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ id: 209, ...registration }, { status: 201 })
  );

  const result = await registerUser({ ...registration, confirmPassword: registration.password });
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, "https://dummyjson.com/users/add");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(options.body), registration);
  assert.deepEqual(result, {
    id: 209, firstName: "Test", lastName: "User", username: "testuser", email: "test@example.com",
  });
  assert.equal(result.password, undefined);
});

for (const status of [400, 409, 503]) {
  test(`registration rejects failed requests (${status})`, async () => {
    mock.method(globalThis, "fetch", async () => new Response(null, { status }));
    await assert.rejects(registerUser(registration), /Unable to register/);
  });
}

test("registration rejects a response without a new user ID", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({}));
  await assert.rejects(registerUser(registration), /Unable to confirm your registration/);
});

test("login posts credentials to DummyJSON and returns the access token", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ accessToken: "test-token", refreshToken: "unused-token" })
  );

  assert.equal(await loginUser("emilys", "emilyspass"), "test-token");
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, "https://dummyjson.com/auth/login");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(options.body), {
    username: "emilys", password: "emilyspass", expiresInMins: 30,
  });
});

test("remembered logins request a seven-day token", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ accessToken: "remembered-token" })
  );
  assert.equal(await loginUser("emilys", "emilyspass", true), "remembered-token");
  const [, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(JSON.parse(options.body).expiresInMins, 10080);
});

for (const status of [400, 401]) {
  test(`login rejects invalid credentials (${status})`, async () => {
    mock.method(globalThis, "fetch", async () =>
      Response.json({ message: "Invalid credentials" }, { status })
    );
    await assert.rejects(loginUser("emilys", "wrong"), /Invalid username or password/);
  });
}

test("login rejects server failures and does not accept an error body as a session", async () => {
  mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(loginUser("emilys", "emilyspass"), /Unable to sign in/);
});

test("login rejects a successful response without an access token", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ id: 1 }));
  await assert.rejects(loginUser("emilys", "emilyspass"), /Unable to sign in/);
});

test("profile uses the bearer token and returns the authenticated user", async () => {
  const user = { id: 1, firstName: "Emily", username: "emilys" };
  const fetchMock = mock.method(globalThis, "fetch", async () => Response.json(user));
  const controller = new AbortController();

  assert.deepEqual(await fetchUser("test-token", { signal: controller.signal }), user);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, "https://dummyjson.com/auth/me");
  assert.equal(options.headers.Authorization, "Bearer test-token");
  assert.equal(options.cache, "no-store");
  assert.equal(options.signal, controller.signal);
});

for (const status of [401, 403]) {
  test(`profile exposes rejected session status (${status}) so storage can be cleared`, async () => {
    mock.method(globalThis, "fetch", async () => new Response(null, { status }));
    await assert.rejects(fetchUser("expired-token"), (error) =>
      error.status === status && /session has expired/.test(error.message)
    );
  });
}

test("network failures reject instead of returning a user", async () => {
  mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(loginUser("emilys", "emilyspass"), TypeError);
  await assert.rejects(fetchUser("test-token"), TypeError);
  await assert.rejects(registerUser(registration), TypeError);
});
