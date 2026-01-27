// Simple in-memory cache with TTL
const store = new Map();

export function setCache(key, value, ttlMs) {
  const expires = Date.now() + (ttlMs || 0);
  store.set(key, { value, expires });
}

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expires && Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function delCache(key) {
  store.delete(key);
}

export function CacheTTL(hours = 12) {
  return hours * 60 * 60 * 1000;
}
