import { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis";
import { getConnectionElp, getConnectionIlp } from "../config/database";

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

    const ilp = await getConnectionIlp();
    const elp = await getConnectionElp();

    let person = null;

    const query = `SELECT people.codigo, people.paterno, people.materno, people.nombres, carer.nomesp FROM alumno AS people
       JOIN tb_ficha_perso_alu as tfpa on people.codigo =  tfpa.c_codalu
       JOIN tb_especialidad as carer on people.c_codesp = carer.codesp
       WHERE people.codigo = ?`;

    const [rowsElp] = (await elp.query(query, [req.params.id])) as any;

    if (rowsElp[0]) {
      person = rowsElp[0];
    } else {
      const [rowsIlp] = (await ilp.query(query, [req.params.id])) as any;
      if (rowsIlp[0]) {
        person = rowsIlp[0];
      }
    }

    if (!person) throw new Error("Person not found");

    await redisClient.set(`person_${id}`, JSON.stringify(person), {
      EX: 60 * 60 * 24 * 30,
    });

    res.json(person);
  } catch (error) {
    next(error);
  }
};
