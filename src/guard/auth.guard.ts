import { RedisCacheService } from "@core/modules/cache/redis-cache.service";
import { CanActivate, ExecutionContext, Injectable, Logger, mixin, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Optional } from "@type/common.type";
import { HttpService, Session } from "be-core";
import { AuthenConfig } from "~/config";
import { RolePermission, UserSession } from "./auth.dto";
import * as _ from 'lodash'
import { RoleFeature } from "./auth.const";

export enum Roles {
    Admin = 1,
    Shop = 2,
    Customer,
    Partner,
}

export const Authorize = (featureName, role: Roles = Roles.Admin, isDontNeedLogin = false): Type<CanActivate> => {
    @Injectable()
    class RoleGuardMixin implements CanActivate {
        private readonly logger: Logger
        constructor(
            private httpService: HttpService,
            private configService: ConfigService,
            private redisCacheService: RedisCacheService
        ) {
            this.logger = new Logger(RoleGuardMixin.name)
        }
        async canActivate(context: ExecutionContext): Promise<boolean> {
            context.getHandler()
            const ctx = context.switchToHttp()

            const request = ctx.getRequest<Request & { scopeVariable: { session: Session } }>();

            const authenConfig = this.configService.get<AuthenConfig>('authen')
            if (!authenConfig) return false;

            const { accesstoken: accessToken } = request.headers as any
            if (!accessToken) {
                return false
            }

            const getUserSession = async (): Promise<Optional<UserSession>> => {
                const url = `${authenConfig.endpointCheckLogin}?accessToken=${accessToken}`;

                try {
                    const response = await this.httpService.get<UserSession>(`${authenConfig.host}${url}`);

                    const { data: userSession } = response
                    userSession;
                    if (userSession && userSession.userId > 0) {
                        await this.redisCacheService.set('', accessToken, userSession, 11520)
                        return userSession
                    }
                } catch (error) {
                    this.logger.log('[Identity] GetUserSession', JSON.stringify({ host: authenConfig.host, url, error }))
                }
                return null
            }

            const checkPermission = async (featureName: string, roles: number[]): Promise<boolean> => {

                let rolePermissions: RolePermission[] = null;
                rolePermissions = await this.redisCacheService.get('', RoleFeature)
                if (!rolePermissions || !rolePermissions.length) {
                    return rolePermissions && !!rolePermissions.find(x => roles.includes(x.roleId) && x.name == featureName && x.isEnabled)
                }

                const url = `${authenConfig.host}${authenConfig.endpointRolePermission}`
                try {
                    const response = await this.httpService.get<RolePermission[]>(url);
                    const { data } = response
                    rolePermissions = data
                    await this.redisCacheService.set('', RoleFeature, rolePermissions, 60)
                } catch (error) {
                    this.logger.log('[Identity] GetUserSession', JSON.stringify({ host: authenConfig.host, url, error }))
                }

                return rolePermissions && !!rolePermissions.find(x => roles.includes(x.roleId) && x.name == featureName && x.isEnabled)
            }

            const activeSession = (userSession: UserSession): void => {
                const scopeVariable = {
                    ...request.scopeVariable,
                    session: {
                        ...request.scopeVariable?.session,
                        userId: userSession.userId
                    }
                }
                request.scopeVariable = scopeVariable
            }

            if (isDontNeedLogin) return true

            const userSession = await getUserSession();
            if (!userSession) return false;

            // //Administrator
            if (userSession.roles.includes(Roles.Admin)) {
                activeSession(userSession)
                return true
            }

            if (!userSession.roles.includes(role))
                return false

            if (featureName) {
                const result = await checkPermission(featureName, userSession.roles)
                if (!result) return false
            }

            activeSession(userSession)
            return true
        }
    }
    return mixin(RoleGuardMixin);
}
