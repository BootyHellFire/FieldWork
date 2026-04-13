import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseSync("fieldwork.db");

export type PendingUpload = {
  id: string;
  kind: "segment" | "snapshot" | "audio";
  payload_json: string;
  status: "pending" | "syncing" | "failed";
  created_at: string;
};

export function initializeOfflineQueue() {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS pending_uploads (
      id TEXT PRIMARY KEY NOT NULL,
      kind TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `);
}

export function queueUpload(upload: PendingUpload) {
  database.runSync(
    `INSERT OR REPLACE INTO pending_uploads (id, kind, payload_json, status, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [upload.id, upload.kind, upload.payload_json, upload.status, upload.created_at],
  );
}

export function listPendingUploads(): PendingUpload[] {
  return database.getAllSync<PendingUpload>(
    `SELECT * FROM pending_uploads ORDER BY created_at ASC;`,
  );
}
