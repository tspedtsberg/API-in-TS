import type { Request, Response } from "express";

import { createUser, upgradeToChirpyRed } from "../db/queries/users.js";
import { badRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword, comparePassword, makeRefreshToken, getBearerToken, validateJWT, getAPIKey } from "../auth.js";
import { getUserByEmail, updateUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { NewUser } from "src/db/schema/schema.js";
import { makeJWT } from "../auth.js";
import { saveRefreshToken, userForRefreshToken, revokeRefreshToken } from "../db/queries/tokens.js";
import { is } from "drizzle-orm";



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
        isChirpyRed: user.isChirpyRed,
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
        isChirpyRed: user.isChirpyRed,
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);

    const result = await userForRefreshToken(refreshToken);
    if (!result) {
        throw new UserNotAuthenticatedError("Refresh token not found");
    }

    const user = result.user;
    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    type response = {
        token: String;
    };

    respondWithJSON(res, 200, {
        token: accessToken,
    } satisfies response);
    
}

export async function handlerRevoke(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);

    await revokeRefreshToken(refreshToken);
    res.status(204).send();

}

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameter = {
        email: string;
        password: string;
    }

    const params: parameter = req.body;

    
    const token = getBearerToken(req);
    const subject = validateJWT(token, config.jwt.secret);

    if (!params.email || !params.password) {
        throw new badRequestError("Missing email or password field!");
    }

    const hashPass = await hashPassword(params.password);

    const user = await updateUser(subject, params.email, hashPass);
    if (!user) {
        throw new Error("Could not update user");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    } satisfies UserResponse);
}
// input
//{
//  "event": "user.upgraded",
//  "data": {
//    "user_id": "3311741c-680c-4546-99f3-fc9efac2036c"
//  }
// }

export async function handlerMakeUserChirpyRed(req: Request, res: Response) {
    type parameter = {
        event: string;
        data: {
            userId: string;
        }
    }
    const params: parameter = req.body;
    let api = getAPIKey(req);
    if (api !== config.polka.polkaKey) {
        throw new UserNotAuthenticatedError("Invalid API key");
    }

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    await upgradeToChirpyRed(params.data.userId);
    res.status(204).send();
}

