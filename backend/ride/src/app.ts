import express from 'express';
import routes from './routes';

const app = express();
routes(app);
app.listen(3000, () => {
    console.log(`Server started on port http://localhost:${3000}`);
});


export default app;