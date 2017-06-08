import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
    static config = {};

    setConfig(config: object): void {
        ConfigService.config = config;
    }

    getConfig(): object {
        return ConfigService.config;
    }
}