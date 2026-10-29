"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../validation/login";
import styles from "./login.module.css";

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "", rememberMe: false },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [isLoading, user, router]);

  async function onSubmit({ username, password, rememberMe }) {
    if (isLoading || user) return;

    try {
      await login(username, password, rememberMe);
      resetField("password");
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof TypeError
          ? "Unable to connect. Check your connection and try again."
          : error.message,
      });
    }
  }

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginCard} aria-labelledby="login-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Your account</p>
          <h1 id="login-title">Welcome back</h1>
          <p>Log in to view your profile and account details.</p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
          aria-describedby={errors.root?.server ? "login-error" : undefined}
          noValidate
        >
          <fieldset className={styles.fields} disabled={isLoading || isSubmitting || !!user}>
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                {...register("username")}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "username-error" : undefined}
                aria-required="true"
              />
              {errors.username && (
                <p id="username-error" className={styles.fieldError} role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-required="true"
              />
              {errors.password && (
                <p id="password-error" className={styles.fieldError} role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  aria-describedby="remember-note"
                />
                Remember me
              </label>
              <p id="remember-note" className={styles.rememberNote}>
                Stay signed in for up to 7 days on this device.
              </p>
            </div>
            {errors.root?.server && (
              <p id="login-error" className={styles.error} role="alert">
                {errors.root.server.message}
              </p>
            )}
            <button type="submit" className={styles.submitButton}>
              {isLoading ? "Checking session..." : isSubmitting || user ? "Signing in..." : "Log in"}
            </button>
          </fieldset>
        </form>

        <p className={styles.accountLink}>
          New here? <Link href="/register">Create an account</Link>
        </p>
        <div className={styles.demoAccount}>
          <h2>Try a demo account</h2>
          <p>Username: <code>emilys</code></p>
          <p>Password: <code>emilyspass</code></p>
        </div>
        <Link href="/" className={styles.backLink}>Continue browsing products</Link>
      </section>
    </div>
  );
}
