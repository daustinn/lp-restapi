import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const { SQLITE_DATABASE } = process.env;

let db: Database | null = null;

export async function connectToSQLite() {
  try {
    db = await open({
      filename: SQLITE_DATABASE!,
      driver: sqlite3.Database,
    });
    console.log(`Connected to SQLite database: ${SQLITE_DATABASE}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function closeConnection() {
  if (db) {
    try {
      await db.close();
      console.log("SQLite connection closed.");
    } catch (error) {
      console.error("Error closing the connection:", error);
    }
  }
}

export function getConnection() {
  if (!db) {
    throw new Error("SQLite connection has not been established yet.");
  }
  return db;
}
