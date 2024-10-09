import { NextFunction, Request, Response } from "express";

const adminToken = process.env.ADMIN_TOKEN!;

export const authorizationAdminHandle = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;

    if (token !== adminToken) {
      throw new Error("Unauthorized");
    }

    next();
  } catch (error) {
    next(error);
  }
};
