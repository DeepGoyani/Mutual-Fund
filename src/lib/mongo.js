let _client = null;
let _db = null;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "mf_portal";
  if (!uri) throw new Error("MONGODB_URI not set");
  try {
    if (!_client) {
      const { MongoClient } = await import("mongodb");
      _client = new MongoClient(uri, { ignoreUndefined: true });
      await _client.connect();
      _db = _client.db(dbName);
    }
    return _db;
  } catch (e) {
    // Helpful message if dependency is missing
    if (e?.code === 'ERR_MODULE_NOT_FOUND' || String(e?.message || '').includes('Cannot find module')) {
      throw new Error("Missing 'mongodb' package. Please run: npm install mongodb");
    }
    throw e;
  }
}

export function activeSinceDate(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() - (Number(process.env.ACTIVE_WINDOW_DAYS) || days));
  d.setHours(0,0,0,0);
  return d;
}
