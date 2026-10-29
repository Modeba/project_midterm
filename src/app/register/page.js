"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/users";
import { registrationSchema } from "../../validation/registration";
import styles from "../login/login.module.css";

const fields = [
  { name: "firstName", label: "First name", autoComplete: "given-name", halfWidth: true },
  { name: "lastName", label: "Last name", autoComplete: "family-name", halfWidth: true },
  { name: "username", label: "Username", autoComplete: "username" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
];

export default function RegistrationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [registeredUser, setRegisteredUser] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [isLoading, user, router]);

  async function onSubmit(values) {
    if (isLoading || user || registeredUser) return;

    try {
      const newUser = await registerUser(values);
      reset();
      setRegisteredUser(newUser);
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
      <section className={styles.loginCard} aria-labelledby="register-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Your account</p>
          <h1 id="register-title">{registeredUser ? "Registration received" : "Create an account"}</h1>
          <p>{registeredUser ? "Your demo registration was submitted successfully." : "Enter your details to get started."}</p>
        </header>

        <p className={styles.notice}>
          Demo registration: new accounts are not saved and cannot be used to log in.
        </p>

        {registeredUser ? (
          <div className={styles.success} role="status">
            Thanks, {registeredUser.firstName}. Your registration request was accepted.
            You can try the demo account on the login page.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-busy={isSubmitting}
            aria-describedby={errors.root?.server ? "register-error" : undefined}
            noValidate
          >
            <fieldset className={styles.fields} disabled={isLoading || isSubmitting || !!user}>
              <div className={styles.registrationGrid}>
                {fields.map((field) => {
                  const fieldError = errors[field.name];
                  const errorId = `register-${field.name}-error`;
                  return (
                    <div
                      key={field.name}
                      className={`${styles.field} ${field.halfWidth ? styles.nameField : ""}`}
                    >
                      <label htmlFor={`register-${field.name}`}>{field.label}</label>
                      <input
                        id={`register-${field.name}`}
                        {...register(field.name)}
                        type={field.type || "text"}
                        autoComplete={field.autoComplete}
                        autoCapitalize={field.name === "username" || field.name === "email" ? "none" : undefined}
                        spellCheck={false}
                        aria-required="true"
                        aria-invalid={!!fieldError}
                        aria-describedby={fieldError ? errorId : field.name === "password" ? "password-hint" : undefined}
                      />
                      {fieldError ? (
                        <p id={errorId} className={styles.fieldError} role="alert">{fieldError.message}</p>
                      ) : field.name === "password" ? (
                        <p id="password-hint" className={styles.fieldHint}>Use at least 8 characters.</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {errors.root?.server && (
                <p id="register-error" className={styles.error} role="alert">
                  {errors.root.server.message}
                </p>
              )}
              <button type="submit" className={styles.submitButton}>
                {isLoading ? "Checking session..." : isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </fieldset>
          </form>
        )}

        <p className={styles.accountLink}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
        <Link href="/" className={styles.backLink}>Continue browsing products</Link>
      </section>
    </div>
  );
}
