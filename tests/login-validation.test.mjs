import assert from "node:assert/strict";
import { test } from "node:test";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../src/validation/login.js";

const validate = yupResolver(loginSchema);
const options = { criteriaMode: "firstError", fields: {}, shouldUseNativeValidation: false };

test("empty login fields produce separate accessible field errors", async () => {
  const result = await validate({ username: "", password: "" }, {}, options);
  assert.deepEqual(result.values, {});
  assert.equal(result.errors.username.message, "Please enter your username.");
  assert.equal(result.errors.password.message, "Please enter your password.");
});

test("whitespace-only usernames cannot pass validation", async () => {
  const result = await validate({ username: "  \t ", password: "emilyspass" }, {}, options);
  assert.deepEqual(result.values, {});
  assert.ok(result.errors.username);
  assert.equal(result.errors.password, undefined);
});

test("valid demo credentials pass through the resolver", async () => {
  const credentials = { username: "emilys", password: "emilyspass" };
  const result = await validate(credentials, {}, options);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, { ...credentials, rememberMe: false });
});

test("usernames are trimmed without changing passwords", async () => {
  const result = await validate({ username: "  emilys  ", password: " password " }, {}, options);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, { username: "emilys", password: " password ", rememberMe: false });
});

test("the remember-me selection is preserved by validation", async () => {
  const credentials = { username: "emilys", password: "emilyspass", rememberMe: true };
  const result = await validate(credentials, {}, options);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, credentials);
});
