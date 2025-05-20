export async function clearLocalDb() {
  if ("indexedDB" in window) {
    const dbs = await window.indexedDB.databases?.();
    if (dbs) {
      for (const db of dbs) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      }
    }
  }
}
