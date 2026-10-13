async function getUser() {
  const res = await fetch("https://dummyjson.com/users/1");

  if (!res.ok) {
    throw new Error(`Failed to fetch profile (status ${res.status})`);
  }

  return res.json();
}

export default async function ProfilePage() {
  const user = await getUser();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <main>
      <h1>Profile</h1>
      <img src={user.image} alt={fullName} width={96} height={96} />
      <h2>{fullName}</h2>
      <p>@{user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>
        Location: {user.address?.city}, {user.address?.country}
      </p>
    </main>
  );
}
