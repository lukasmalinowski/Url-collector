require('dotenv').config();

import { AppConfig } from './config';
import { createAppContainer } from './container';
import Logger from './utils/logger';

async function bootstrapApp() {
  const appConfig = new AppConfig();
  const container = await createAppContainer(appConfig);

  const { httpServer } = container.cradle;

  const port = appConfig.port;

  httpServer.listen(port, () => {
    Logger.info(
      {
        action: 'APP_START',
      },
      `Server started on port: ${port}`
    );
  });
}

bootstrapApp();
