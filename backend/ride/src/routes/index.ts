import { Express, json } from 'express';
import accountRouter from './accountRouter';
import rideRouter from './rideRouter';
export default (app: Express) => {
    return app.use(
        json(),
        accountRouter,
        rideRouter
    );
}