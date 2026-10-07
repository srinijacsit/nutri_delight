import app from './app';
import { env } from './config/env';
import { verifyConnection } from './config/supabase';

const PORT = env.PORT;

async function startServer() {
  await verifyConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
}

startServer();
