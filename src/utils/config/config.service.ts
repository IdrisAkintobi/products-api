import { Inject, Injectable } from '@nestjs/common';
import { JwtConfigType, MongoConfigType } from '../../types/config.schema.type';
import { ZodErrorParser } from '../resources/zod.error.parser';
import { jwtConfigSchema, mongoConfigSchema } from './config-schema';

const getMongoConfigFromEnv = (env: NodeJS.ProcessEnv) => {
    try {
        return mongoConfigSchema.parse({
            uri: env.MONGO_URI,
            rootUser: env.MONGO_INITDB_ROOT_USERNAME,
            rootPassword: env.MONGO_INITDB_ROOT_PASSWORD,
        });
    } catch (e) {
        ZodErrorParser(e);
    }
};

const getJwtConfigFromEnv = (env: NodeJS.ProcessEnv) => {
    try {
        return jwtConfigSchema.parse({
            jwtSecret: env.JWT_SECRET,
        });
    } catch (e) {
        ZodErrorParser(e);
    }
};

@Injectable()
export class ConfigurationService {
    private _getMongoConfigFromEnv: MongoConfigType;
    private _getJwtConfigFromEnv: JwtConfigType;
    constructor(@Inject('process.env') private env: NodeJS.ProcessEnv) {
        this._getMongoConfigFromEnv = getMongoConfigFromEnv(env);
        this._getJwtConfigFromEnv = getJwtConfigFromEnv(env);
    }

    getMongoConfig() {
        return this._getMongoConfigFromEnv;
    }

    getJwtConfig() {
        return this._getJwtConfigFromEnv;
    }
}
