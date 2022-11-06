import { IGNORE_RESPONSE_KEY } from '@core/decorators/ignore-core-response.decorator';
import { SuccessResponse } from '@core/response.model';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse> {
    constructor(private reflector: Reflector) { }
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse | any> | Promise<Observable<SuccessResponse | any>> {
        const observable = next.handle();
        return observable.pipe(
            map((data) => {
                const excludeCoreInterceptor = this.reflector.get(IGNORE_RESPONSE_KEY, context.getClass());
                if (excludeCoreInterceptor) return data;
                return new SuccessResponse(data);
            })
        );
    }
}
