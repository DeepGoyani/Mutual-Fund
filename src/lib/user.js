import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export function getUserId() {
  const jar = cookies();
  const existing = jar.get("userId")?.value;
  if (existing) return existing;
  const id = randomUUID();
  // Note: In App Router route handlers, we can't set cookies via this module directly in some runtimes.
  // We'll set cookie in API handlers when needed.
  return id;
}
