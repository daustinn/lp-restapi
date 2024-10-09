import { NextFunction, Request, Response } from "express";
import { getConnection } from "../config/sqlite";

export const authorizationHandle = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    const finded = await getConnection().get(
      `SELECT * FROM tokens WHERE value = ?`,
      [token]
    );

    if (!finded) throw new Error("Unauthorized");

    next();
  } catch (error) {
    next(error);
  }
};
