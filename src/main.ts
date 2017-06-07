import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConfigLoader } from "app/utils";
import { BackendService } from "app/services/backend.service";
import { LocalBackendService } from "app/services/local-backend.service";

ConfigLoader.then(config => {

  if (environment["production"]) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule, {providers: [
    { provide: BackendService, useClass: LocalBackendService }
  ]});
});
