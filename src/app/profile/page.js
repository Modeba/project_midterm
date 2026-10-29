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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.profile}>
        <h1>Profile</h1>

        <p>
        Name: {user.name.firstname} {user.name.lastname}
        </p>

        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>

        <h2>Address</h2>

        <p>
        {user.address.number} {user.address.street}
        </p>

        <p>{user.address.city}</p>
        <p>{user.address.zipcode}</p>
    </div>
    );
}