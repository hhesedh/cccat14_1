import { Router } from "express";
import { getAccountController, signupController } from "../controllers/accountController";

const accountRouter = Router();
accountRouter.get('/account/:uuid', getAccountController);
accountRouter.post('/signup', signupController);

export default accountRouter;