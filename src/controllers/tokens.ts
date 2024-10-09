import { NextFunction, Request, Response } from "express";
import { getConnection } from "../config/sqlite";
import { z } from "zod";

export const getAllTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await getConnection().all(`SELECT * FROM tokens`);
    res.json({ tokens });
  } catch (error) {
    next(error);
  }
};

export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = z
      .object({
        name: z.string(),
      })
      .safeParse(await req.body);

    if (!validation.success) throw new Error("Illegal arguments");

    const { name } = validation.data;

    const token = crypto.randomUUID();

    await getConnection().run(
      `INSERT INTO tokens (name, value) VALUES (?, ?)`,
      [name, token]
    );

    res.json(token);
  } catch (error) {
    next(error);
  }
};

export const deleteToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await getConnection().run(`DELETE FROM tokens WHERE id = ?`, [id]);
    res.json({ id });
  } catch (error) {
    next(error);
  }
};
