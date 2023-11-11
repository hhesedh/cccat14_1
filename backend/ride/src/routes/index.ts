import { Express, json } from 'express';
import accountRouter from './accountRouter';
export default (app: Express) => {
    return app.use(
        json(),
        accountRouter
    );
}