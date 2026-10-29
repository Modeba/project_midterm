import assert from "node:assert/strict";
import { test } from "node:test";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationSchema } from "../src/validation/registration.js";

const validate = yupResolver(registrationSchema);
const options = { criteriaMode: "firstError", fields: {}, shouldUseNativeValidation: false };
const validData = {
  firstName: "Test", lastName: "User", username: "testuser", email: "test@example.com",
  password: "test-password", confirmPassword: "test-password",
};

test("all registration fields are required", async () => {
  const result = await validate({}, {}, options);
  assert.deepEqual(result.values, {});
  for (const field of Object.keys(validData)) assert.ok(result.errors[field], field);
});

test("invalid email, username, short password, and mismatched confirmation are rejected", async () => {
  const result = await validate({
    ...validData, username: "bad name", email: "invalid", password: "short", confirmPassword: "different",
  }, {}, options);
  assert.deepEqual(result.values, {});
  for (const field of ["username", "email", "password", "confirmPassword"]) {
    assert.ok(result.errors[field], field);
  }
});

test("short usernames and whitespace-only names are rejected", async () => {
  const result = await validate({ ...validData, firstName: "  ", lastName: "\t", username: "ab" }, {}, options);
  assert.deepEqual(result.values, {});
  for (const field of ["firstName", "lastName", "username"]) assert.ok(result.errors[field], field);
});

test("valid registration trims contact fields while preserving matching passwords", async () => {
  const result = await validate({
    ...validData, firstName: " Test ", lastName: " User ", username: " testuser ",
    email: " test@example.com ", password: " password ", confirmPassword: " password ",
  }, {}, options);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, { ...validData, password: " password ", confirmPassword: " password " });
});
