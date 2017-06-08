import { ConfigService } from "app/services/config.service";
import { LocalBackendService } from "app/services/local-backend.service";
import { BackendService } from "app/services/backend.service";
import { OskioskBackendService } from "app/services/oskiosk-backend.service";
import { Http } from "@angular/http";

let backendServiceFactory = (http: Http) => {
    let config = ConfigService.config;

    if(config['backend_type'] == 'oskiosk'){
        return new OskioskBackendService(http, config['backend_config']['url'], config['backend_config']['token']);
    }
    else {
        return new LocalBackendService();
    }
};

export let BackendServiceProvider = {
    provide: BackendService,
    useFactory: backendServiceFactory,
    deps: [Http]
};