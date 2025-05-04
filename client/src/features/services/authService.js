// authService.js
const API = 'http://localhost:5002';

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const { token } = await res.json();
  localStorage.setItem('authToken', token);
  return token;
}

export function getToken() {
  return localStorage.getItem('authToken');
}
