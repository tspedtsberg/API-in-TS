import { config } from "../config.js";
import { Request, Response } from "express";

export function handlerMetrics(_: Request, res: Response) {
    res.send(`<html>
        <body>
          <h1>Welcome, Chirpy Admin</h1>
          <p>Chirpy has been visited ${config.fileServerHits} times!</p>
        </body>
      </html>`
    );
    res.end();
};