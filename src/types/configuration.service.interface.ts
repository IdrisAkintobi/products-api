import { JwtConfigType, MongoConfigType } from './config.schema.type';

export interface ConfigurationServiceInterface {
    getJwtConfig(): JwtConfigType;
    getMongoConfig(): MongoConfigType;
}
