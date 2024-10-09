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

    let match = null;

    const query = `SELECT
                  a.codigo,
                  a.paterno,
                  a.materno,
                  a.nombres,
                  te.c_abrevesp,
                  tfpa.c_sexo,
                  tfpa.c_email_institucional,
                  tmf.n_codper,
                  tp.c_perlit
                FROM
                  alumno a
                  JOIN tb_ficha_perso_alu tfpa ON a.codigo = tfpa.c_codalu
                  JOIN tb_especialidad te ON a.c_codesp = te.codesp
                  JOIN tb_mat_fic tmf ON a.codigo = tmf.c_codalu
                  AND a.facultad = tmf.c_codfac
                  AND a.c_codesp = tmf.c_codesp
                  JOIN tb_peracd tp ON tp.n_codper = tmf.n_codper
                WHERE
                  a.codigo = ?
                ORDER BY
                  tmf.n_codper DESC
                LIMIT
                  1`;

    const [rowsElp] = (await elp.query(query, [req.params.id])) as any;

    if (rowsElp[0]) {
      match = rowsElp[0];
    } else {
      const [rowsIlp] = (await ilp.query(query, [req.params.id])) as any;
      if (rowsIlp[0]) {
        match = rowsIlp[0];
      }
    }

    if (!match) throw new Error("Person not found");

    const person = {
      id: match.codigo,
      firstName: match.nombres.trim(),
      lastName: `${match.paterno} ${match.materno}`,
      email: match.c_email_institucional,
      career: match.c_abrevesp,
      sex: match.c_sexo,
      periodCode: match.n_codper,
      periodName: match.c_perlit,
      institution: rowsElp[0] ? "ELP" : "ILP",
    };
    await redisClient.set(`person_${id}`, JSON.stringify(person), {
      EX: 60 * 60 * 24 * 30,
    });

    res.json(person);
  } catch (error) {
    next(error);
  }
};
