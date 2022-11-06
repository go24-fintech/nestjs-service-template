enum UserHttpCode {
    Error = -1,
    Success = 0,
    Warning = 1
}

export interface CoreRes<T = any> {
    code?: string;
    data: T;
    errorMessage: string;
    result: UserHttpCode
}

export class SuccessResponse<T = any> implements Omit<CoreRes<T>, 'code' | 'errorMessage'> {
    data: T;
    result: UserHttpCode
    constructor(data: T) {
        this.data = data
        this.result = UserHttpCode.Success
    }
}

export class WarningResponse<T = any> implements Omit<CoreRes<T>, 'data'> {
    code?: string;
    errorMessage: string;
    result: UserHttpCode

    constructor(message: string, code?: string) {
        this.code = code
        this.errorMessage = message
        this.result = UserHttpCode.Warning
    }
}

export class ErrorResponse<T = any> implements Omit<CoreRes<T>, 'data'> {
    code?: string;
    errorMessage: string;
    result: UserHttpCode

    constructor(message: string, code?: string) {
        this.code = code
        this.errorMessage = message
        this.result = UserHttpCode.Error
    }
}
