import express, { Application } from 'express';
import routes from './routes';
import { env, constants } from '../config';

import {
	ClerkExpressRequireAuth,
	createClerkClient,
} from '@clerk/clerk-sdk-node';
import { StrictAuthProp } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import multer from 'multer';
import { uploadAsset } from './controllers/Assets.controller';
import { initializeDatabase } from './init-db';

const app: Application = express();
const upload = multer({
	storage: multer.memoryStorage(),
});

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}

app.use(
	cors({
		origin: constants.origin,
		optionsSuccessStatus: constants.optionsSuccessStatus,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
export const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

app.all('/api/*', ClerkExpressRequireAuth(), (_, __, next) => {
	next();
});

app.use((err: any, _: any, res: any, __: any) => {
	console.error(err.stack);
	res.status(401).send('Unauthenticated!');
});
*/
app.post('/api/assets/:folder', upload.single('file'), uploadAsset);

routes(app);

// Inicializar o banco de dados antes de iniciar o servidor
(async () => {
  try {
    await initializeDatabase();
    
    app.listen(constants.port, () => {
      console.log(`Server is running at http://localhost:${constants.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
