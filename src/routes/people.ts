import { Router } from "express";
import { getPerson } from "../controllers";

const peopleRoutes = Router();

peopleRoutes.get("/:id", getPerson);

export { peopleRoutes };
