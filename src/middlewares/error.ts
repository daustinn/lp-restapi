import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    next(err);
  }

  res.status(400).json({
    lp: {
      status: 400,
      message: err.name,
      error: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body,
      params: req.params,
      headers: req.headers,
      cookies: req.cookies,
    },
  });
}
