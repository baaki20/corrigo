import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const cookieName = "corrigo_admin";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "corrigo-development-secret-change-me");

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const jar = await cookies();
  jar.set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function getAdminSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" ? { email: String(payload.email) } : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
