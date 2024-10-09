import { Router } from "express";
import { peopleRoutes } from "./people";
import { authorizationHandle } from "../middlewares/authorization";
export const routes = Router();

routes.use("/people", authorizationHandle, peopleRoutes);
