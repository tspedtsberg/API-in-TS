import { config } from "../config.js";
import { Request, Response } from "express";

export function handlerReset(_: Request, res: Response) {   
    config.fileServerHits = 0;
    res.write("Hits reset to 0");
    res.end();
}