import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

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
    config.fileServerHits++;
    next();
}

    