import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ConfigurationService } from '../utils/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('ConfigurationService')
        private readonly configurationService: ConfigurationService,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();
        const response = http.getResponse<FastifyReply>();
        const bearerToken = this.extractBearerToken(request);

        if (!bearerToken) {
            await response.status(401).send('UNAUTHORIZED');
            return false;
        }

        const { jwtSecret } = this.configurationService.getJwtConfig();

        try {
            const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(bearerToken, {
                secret: jwtSecret,
            });

            request.headers['x-subject'] = sub;
            return true;
        } catch (e) {
            if (e instanceof Error) {
                await response.status(401).send(e.message);
                return false;
            }

            throw e;
        }
    }

    private extractBearerToken(request: FastifyRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
