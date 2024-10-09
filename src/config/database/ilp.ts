import mysql from "mysql2/promise";

let connection: mysql.Connection;

export async function connectToMysqlIlp() {
  try {
    connection = await mysql.createConnection({
      host: "167.172.247.15",
      user: "ilp_api_dev",
      password: "42$25@%hK?dR60P&8%a",
      database: "sigu_db_ilp_lic",
      port: 3306,
    });
    console.log(`Connected to MySQL database: ${process.env.DATABASE_ILP}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function closeConnectionIlp() {
  if (connection) {
    try {
      await connection.end();
      console.log("MySQL connection closed.");
    } catch (error) {
      console.error("Error closing the connection:", error);
    }
  }
}

export function getConnectionIlp() {
  if (!connection) {
    throw new Error("MySQL connection has not been established yet.");
  }
  return connection;
}
