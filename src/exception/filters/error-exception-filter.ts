import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ConflictException,
    ExceptionFilter,
    Inject,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { MongoServerError } from 'mongodb';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpError } from '../../utils/resources/http-error';
import { HttpResponse } from '../../utils/resources/http-response';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async catch(err: Error, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        const logData = {
            isFatal: err instanceof InternalServerErrorException,
            exception: err,
            requestBody: request.body,
            requestQuery: request.query,
            requestHeaders: request.headers,
        };

        switch (true) {
            case err instanceof MongoServerError && err.code === 11000: {
                const key = Object.keys(err.keyPattern)[0];
                const value = Object.values(err.keyValue)[0];

                const httpErrors: HttpError[] = [
                    {
                        errorCode: '409',
                        errorMessage: `Duplicate Key Error - ${key} : ${value}`,
                    },
                ];

                const httpResponse: HttpResponse<never> = {
                    success: false,
                    errors: httpErrors,
                };

                await response.status(409).send(httpResponse);
                break;
            }
            case err instanceof ConflictException ||
                err instanceof NotFoundException ||
                err instanceof BadRequestException: {
                this.logger.info(JSON.stringify(logData));
                const errorResponse = err.getResponse();
                const errorCode = err.getStatus();
                const httpErrors = this.getHttpErrorResponse(errorResponse, errorCode);
                const httpResponse: HttpResponse<never> = {
                    success: false,
                    errors: httpErrors,
                };

                await response.status(+errorCode).send(httpResponse);
                break;
            }
            default: {
                this.logger.error(JSON.stringify(logData));
                const httpErrors: HttpError[] = [
                    {
                        errorCode: '500',
                        errorMessage: 'Internal server error',
                    },
                ];
                const httpResponse: HttpResponse<never> = {
                    success: false,
                    errors: httpErrors,
                };
                await response.status(500).send(httpResponse);
            }
        }
    }

    private getHttpErrorResponse(errorResponse: string | object, errorCode: number) {
        const httpErrors: HttpError[] = [];
        if (typeof errorResponse === 'string') {
            httpErrors.push({
                errorCode: errorCode.toString(),
                errorMessage: errorResponse,
            });
        } else if (typeof errorResponse === 'object' && 'message' in errorResponse) {
            const requestErrors = errorResponse as { message: string | string[] };
            if (Array.isArray(requestErrors.message)) {
                requestErrors.message.forEach(message => {
                    httpErrors.push({
                        errorCode: errorCode.toString(),
                        errorMessage: message,
                    });
                });
            } else {
                httpErrors.push({
                    errorCode: errorCode.toString(),
                    errorMessage: requestErrors.message,
                });
            }
        }
        return httpErrors;
    }
}
