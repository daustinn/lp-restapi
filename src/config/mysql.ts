import mysql from "mysql2/promise";

const { MYSQL_DATABASE, MYSQL_URI } = process.env;

let connection: mysql.Connection;

export async function connectToMysql() {
  try {
    connection = await mysql.createConnection(MYSQL_URI!);
    console.log(`Connected to MySQL database: ${MYSQL_DATABASE}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function closeConnection() {
  if (connection) {
    try {
      await connection.end();
      console.log("MySQL connection closed.");
    } catch (error) {
      console.error("Error closing the connection:", error);
    }
  }
}

export function getConnection() {
  if (!connection) {
    throw new Error("MySQL connection has not been established yet.");
  }
  return connection;
}
