"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "../../services/users";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const data = await fetchUser();
      setUser(data);
    }

    loadUser();
  }, []);

  return (
    <div className={styles.profile}>
      <header className={styles.pageHeader}>
        <h1>Your profile</h1>
        <p>Your account details and delivery address.</p>
      </header>

      {!user ? (
        <p className={styles.loading} role="status">Loading profile...</p>
      ) : (
        <>
          <div className={styles.accountCard}>
            <div className={styles.avatar} aria-hidden="true">
              {user.name.firstname.charAt(0)}{user.name.lastname.charAt(0)}
            </div>
            <div>
              <h2 className={styles.name}>{user.name.firstname} {user.name.lastname}</h2>
              <p className={styles.username}>@{user.username}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <section className={styles.detailsCard} aria-labelledby="personal-details">
              <h2 id="personal-details">Personal details</h2>
              <dl className={styles.detailsList}>
                <div>
                  <dt>Name</dt>
                  <dd className={styles.name}>{user.name.firstname} {user.name.lastname}</dd>
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
                  <dd className={styles.name}>{user.address.number} {user.address.street}</dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd className={styles.name}>{user.address.city}</dd>
                </div>
                <div>
                  <dt>ZIP code</dt>
                  <dd>{user.address.zipcode}</dd>
                </div>
              </dl>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
