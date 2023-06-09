import { Router, Response } from 'express';
import path from 'node:path';

const router = Router();

// Using RegEx, this will only runs if the requested route starts or ends with '/' or '/index' or '/index.html'
router.get('^/$|/index(.html)?', (_, res: Response) => {
  // Look for the views/index.html and send the file to the client
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default router;
