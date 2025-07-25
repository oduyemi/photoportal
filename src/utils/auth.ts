import jwt from "jsonwebtoken";

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "supersecret") as { id: string };
  } catch (err: unknown) {
    throw err;
  }
};


export const logout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/'; // Redirect to login
};
