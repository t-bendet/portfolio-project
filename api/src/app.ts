import express from 'express';
import type { Request, Response } from 'express';

// v1 skeleton: /healthz is live; the endpoint surface is wired but returns
// 501 until each item is implemented (auth and rate limiting are Gated-class
// work — specs/security-requirements.md SR-1, SR-5…SR-8).
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '4kb' }));

  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  const notImplemented = (_req: Request, res: Response) => {
    res.status(501).json({ error: 'not implemented' });
  };

  const v1 = express.Router();
  v1.post('/view-events', notImplemented);
  v1.get('/reactions', notImplemented);
  v1.post('/reactions', notImplemented);
  v1.post('/auth/login', notImplemented);
  v1.post('/auth/logout', notImplemented);
  app.use('/api/v1', v1);

  // /admin dashboard is server-rendered here, behind session auth — later.

  return app;
}
