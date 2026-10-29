"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  return (
    <div className={styles.profile}>
      <header className={styles.pageHeader}>
        <h1>Your profile</h1>
        <p>Your account details and delivery address.</p>
      </header>

      {isLoading || !user ? (
        <p className={styles.loading} role="status">
          {isLoading ? "Loading profile..." : "Opening login..."}
        </p>
      ) : (
        <>
          <div className={styles.accountCard}>
            <div className={styles.avatar} aria-hidden="true">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h2 className={styles.name}>{user.firstName} {user.lastName}</h2>
              <p className={styles.username}>@{user.username}</p>
            </div>
            <button type="button" className={styles.logoutButton} onClick={logout}>
              Log out
            </button>
          </div>

          <div className={styles.detailsGrid}>
            <section className={styles.detailsCard} aria-labelledby="personal-details">
              <h2 id="personal-details">Personal details</h2>
              <dl className={styles.detailsList}>
                <div>
                  <dt>Name</dt>
                  <dd className={styles.name}>{user.firstName} {user.lastName}</dd>
                </div>
                <div>
                  <dt>Username</dt>
                  <dd>{user.username}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd><a href={`tel:${user.phone}`}>{user.phone}</a></dd>
                </div>
              </dl>
            </section>

            <section className={styles.detailsCard} aria-labelledby="delivery-address">
              <h2 id="delivery-address">Delivery address</h2>
              <dl className={styles.detailsList}>
                <div>
                  <dt>Street</dt>
                  <dd className={styles.name}>{user.address.address}</dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd className={styles.name}>{user.address.city}</dd>
                </div>
                <div>
                  <dt>ZIP code</dt>
                  <dd>{user.address.postalCode}</dd>
                </div>
              </dl>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
