import mysql from "mysql2/promise";

let connection: mysql.Connection;

export async function connectToMysqlElp() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: "42$25@%hK?dR60P&8%a",
      database: "sigu_db_elp",
      port: 3306,
    });
    console.log(`Connected to MySQL database: ELP`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function closeConnectionElp() {
  if (connection) {
    try {
      await connection.end();
      console.log("MySQL connection closed.");
    } catch (error) {
      console.error("Error closing the connection:", error);
    }
  }
}

export function getConnectionElp() {
  if (!connection) {
    throw new Error("MySQL connection has not been established yet.");
  }
  return connection;
}
