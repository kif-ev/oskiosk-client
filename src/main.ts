import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConfigLoader } from "app/utils";
import { ConfigService } from "app/services/config.service";

ConfigLoader.then(config => {

  new ConfigService().setConfig(config);

  if (environment["production"]) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule);
});
