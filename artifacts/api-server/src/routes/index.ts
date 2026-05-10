import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import contactRouter from "./contact";
import adminRouter from "./admin";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(settingsRouter);

export default router;
