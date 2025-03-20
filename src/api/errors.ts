export class badRequestError extends Error {
   constructor(message: string) {
        super(message);
    }
}

export class UserNotAuthenticatedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class userForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class notFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}