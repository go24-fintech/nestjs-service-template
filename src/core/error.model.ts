import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './response.model';

export class BusinessException extends HttpException {
    constructor(error: string) {
        super(error, HttpStatus.OK);
    }
}

export class NoPermissionException extends HttpException {
    constructor(error: string) {
        super(new ErrorResponse(error), HttpStatus.OK);
    }
}
