import { Router } from "express";
import { createToken, deleteToken, getAllTokens } from "../controllers/tokens";

const tokenRoutes = Router();

tokenRoutes.get("/", getAllTokens);
tokenRoutes.post("/", createToken);
tokenRoutes.delete("/:id", deleteToken);

export { tokenRoutes };
