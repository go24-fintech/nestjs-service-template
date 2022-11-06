import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "be-core";

@Injectable()
export class AuthAuthorize implements CanActivate {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
    }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        context.getHandler();
        const ctx = context.switchToHttp();

        return true;
    }
}
