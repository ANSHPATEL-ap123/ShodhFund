import type { Role, User } from "./types";

const USER = "sf_user";
const VIEW = "sf_view_role";

export function saveUser(user: User) {
  localStorage.setItem(USER, JSON.stringify(user));
  localStorage.setItem(VIEW, user.role);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function viewRole(): Role {
  if (typeof window === "undefined") return "PI";
  return (localStorage.getItem(VIEW) as Role) || getUser()?.role || "PI";
}

export function setViewRole(role: Role) {
  localStorage.setItem(VIEW, role);
}

export function logout() {
  localStorage.removeItem(USER);
  localStorage.removeItem(VIEW);
}
