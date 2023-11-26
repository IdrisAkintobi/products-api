import { Global, Module } from '@nestjs/common';

import { ConfigurationService } from './config/config.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: 'process.env',
            useValue: process.env,
        },
        {
            provide: 'ConfigurationService',
            useClass: ConfigurationService,
        },
    ],
    exports: ['ConfigurationService'],
})
export class UtilModule {}
