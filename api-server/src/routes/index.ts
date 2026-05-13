import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hospitalsRouter from "./hospitals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hospitalsRouter);

export default router;
