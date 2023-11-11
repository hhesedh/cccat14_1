import { Router } from "express";
import { getRideController, requestRideController } from "../controllers/rideController";

const rideRouter = Router();
rideRouter.get('/ride/:uuid', getRideController);
rideRouter.post('/ride', requestRideController);

export default rideRouter;