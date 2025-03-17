import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { badRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export async function handleCreateUser(req: Request, res: Response) {
    type parameter = {
        email: string;
    };
    const params: parameter = req.body;

    if (!params.email) {
        throw new badRequestError("Missing request fields!");
    }

    const user = await createUser({ email: params.email});

    if (!user) {
        throw new Error("Could not make user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    });
}