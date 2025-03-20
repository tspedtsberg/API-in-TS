import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { badRequestError, notFoundError, UserNotAuthenticatedError, userForbiddenError } from "./errors.js";

/* 
function tracks the incoming request and responses. if upon finishing the status code is no
ok status code (above 300), it will log it to the console.
*/
export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`)
        }
    });

    next();
    };

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.api.fileServerHits++;
    next();
}

export function middlewareErrorHandler(err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
  ) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    if (err instanceof badRequestError) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof userForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof notFoundError) {
        statusCode = 404;
        message = err.message;
    } 

    if (statusCode >= 500) {
        console.log(err.message)
    }
 
    respondWithError(res, statusCode, message);
  }
    