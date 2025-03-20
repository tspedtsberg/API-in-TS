import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { badRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword, comparePassword, makeRefreshToken, getBearerToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { NewUser } from "src/db/schema/schema.js";
import { makeJWT } from "../auth.js";
import { saveRefreshToken } from "../db/queries/tokens.js";


export type UserResponse = Omit<NewUser, "hashed_password">;

export async function handleCreateUser(req: Request, res: Response) {
    type parameter = {
        email: string;
        password: string;
    };
    const params: parameter = req.body;

    if (!params.email) {
        throw new badRequestError("Missing email field!");
    }
    if (!params.password) {
        throw new badRequestError("Missing password field!");
    }
    const hashPass = await hashPassword(params.password);

    const user = await createUser({ 
        email: params.email,
        hashed_password: hashPass,
    });

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

type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
};

export async function handleLogin(req: Request, res: Response) {
    type parameter = {
        email: string;
        password: string;
    };
    const params: parameter = req.body;

    if (!params.email) {
        throw new badRequestError("Missing email field!");
    }
    if (!params.password) {
        throw new badRequestError("Missing password field!");
    }
    

    const user = await getUserByEmail(params.email);

    if (!user) {
        throw new badRequestError("User not found!");
    }

    const passwordMatch = await comparePassword(params.password, user.hashed_password);
    if (!passwordMatch) {
        throw new UserNotAuthenticatedError("Password does not match!");
    }

    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = makeRefreshToken();

    const saved = await saveRefreshToken(user.id, refreshToken);
    if (!saved) {
        throw new UserNotAuthenticatedError("Could not save refresh token");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);
    
}