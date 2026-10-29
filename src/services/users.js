export async function fetchUser() {
  const response = await fetch("https://fakestoreapi.com/users/3");
  const data = await response.json();

  return data;
}