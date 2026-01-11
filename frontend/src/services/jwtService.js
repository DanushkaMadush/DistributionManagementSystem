import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token && localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUserFromToken = (token = getToken()) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token = getToken()) => {
  const payload = getUserFromToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const isAuthenticated = () => !isTokenExpired();

export const getUserId = () => getUserFromToken()?.userId || null;
export const getEmployeeId = () => getUserFromToken()?.employeeId || null;
export const getEmail = () => getUserFromToken()?.email || null;
export const getRoles = () => getUserFromToken()?.roles || [];

export const hasRole = (role) => getRoles().includes(role);
export const hasAnyRole = (roles = []) => roles.some((r) => hasRole(r));
export const hasAllRoles = (roles = []) => roles.every((r) => hasRole(r));