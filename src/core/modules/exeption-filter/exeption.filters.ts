import { ErrorResponse } from '@core/response.model';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { isArray } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        let customException = exception;
        const httpAdapter = this.httpAdapterHost?.httpAdapter;

        const status = 200// exception.getStatus();
        const res = exception.getResponse() as
            | { statusCode: number; message: string | string[]; error: string }
            | string;

        if (typeof res === 'object' && isArray(res.message)) {
            const { message } = res;
            const customMessage: Record<string, any>[] = [];
            for (const m of message) {
                const index = m.indexOf(' ');
                const key = m.substring(0, index);
                customMessage.push({ field: key, message: m });
            }
            customException = new HttpException(new ErrorResponse('Validation Exception', customMessage), status);
        }

        if (typeof res === 'object' && typeof res.message === 'string') {
            const { message } = res;
            customException = new HttpException(new ErrorResponse(message), status);
        }

        if (typeof res === 'string') {
            customException = new HttpException(new ErrorResponse(res), status);
        }

        super.catch(customException, host);
    }
}
