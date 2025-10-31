import { authFetch } from "./authFetch";

export async function updateUsernameApi(newUsername: string) {
  const { user } = await authFetch("/profile/username", {
    method: "POST",
    body: JSON.stringify({ username: newUsername }),
  });
  return user; // updated UserClient
}