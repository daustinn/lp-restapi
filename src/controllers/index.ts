import { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis";
import { getConnection } from "../config/mysql";

export const getPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Illegal arguments");

    const cachedPerson = await redisClient.get(`person_${id}`);

    if (cachedPerson) {
      res.json(JSON.parse(cachedPerson));
    }

    const [rows] = (await getConnection().query(
      "SELECT * FROM users WHERE dni = ?",
      [req.params.id]
    )) as any;

    const person = rows[0];

    if (!person) throw new Error("Person not found");

    await redisClient.set(`person_${id}`, JSON.stringify(person), {
      EX: 60 * 60 * 24 * 365,
    });

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
