import { config } from "../config.js";
import { Request, Response } from "express";
import { userForbiddenError } from "./errors.js";
import { reset } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {   
    if (config.api.platform !== "dev") {
        console.log(config.api.platform)
        throw new userForbiddenError("Reset is only allowed in dev environment");
    }

    config.api.fileServerHits = 0;
    await reset();
    res.write("Hits reset to 0");
    res.end();
}