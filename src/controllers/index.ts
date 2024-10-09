import { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis";
import { getConnectionElp } from "../config/database";

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

    // const ilp = await getConnectionIlp();
    const elp = await getConnectionElp();

    const [rows] = (await elp.query(
      `SELECT people.codigo, people.paterno, people.materno, people.nombres, carer.nomesp FROM alumno AS people
       JOIN tb_ficha_perso_alu as tfpa on people.codigo =  tfpa.c_codalu
       JOIN tb_especialidad as carer on people.c_codesp = carer.codesp
       WHERE people.codigo = ?`,
      [req.params.id]
    )) as any;

    const person = rows[0];

    if (!person) throw new Error("Person not found");

    await redisClient.set(`person_${id}`, JSON.stringify(person), {
      EX: 60 * 60 * 24 * 30,
    });

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
