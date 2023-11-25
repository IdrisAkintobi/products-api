import { ConfigurationServiceInterface } from '../../src/types/configuration.service.interface';

export function mockConfigService(): jest.Mocked<ConfigurationServiceInterface> {
    return {
        getJwtConfig: jest.fn().mockReturnValue({
            JWTSecret: 'secret',
        }),

        getMongoConfig: jest.fn().mockReturnValue({
            mongoURI: 'mongoURI',
        }),
    };
}
