import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';

export class Logger {
    constructor() {}

    private dailyRotateFileTransport(): winston.transport {
        return new winston.transports.File({
            level: 'debug',
            filename: `logs/app_log-${new Date().toISOString().slice(0, 10)}.log`,
            zippedArchive: false,
            maxFiles: 2,
            rotationFormat: () => {
                return `logs/app_log-${new Date().toISOString().slice(0, 10)}.log`;
            },
        });
    }

    private consoleTransport(): winston.transport {
        return new winston.transports.Console({
            level: 'silly',
        });
    }

    private customLogFormat(): winston.Logform.Format {
        return winston.format.printf(({ timestamp, level, stack, message }) => {
            return `${timestamp} - [${level}] - ${message} ${stack || ''}`;
        });
    }

    private formatCombine(): winston.Logform.Format {
        return winston.format.combine(
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            utilities.format.nestLike('products-api'),
            this.customLogFormat(),
        );
    }

    private prodLoggerConfig(): WinstonModuleOptions {
        return {
            format: this.formatCombine(),
            transports: [this.dailyRotateFileTransport()],
        };
    }

    private devLoggerConfig(): WinstonModuleOptions {
        return {
            format: this.formatCombine(),
            transports: [this.consoleTransport()],
        };
    }

    public getLoggerConfig(env: string): WinstonModuleOptions {
        return env === 'production' ? this.prodLoggerConfig() : this.devLoggerConfig();
    }
}
