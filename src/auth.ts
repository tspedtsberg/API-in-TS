import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { badRequestError, UserNotAuthenticatedError } from './api/errors.js';
import { Request } from 'express';
import crypto from 'crypto';

export async function hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

type payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

export function makeJWT(userId: string, expiresIn: number, secret: string) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign(
        {
            iss: "chirpy",
            sub: userId,
            iat: issuedAt,
            exp: expiresAt,
        } satisfies payload,
        secret,
        { algorithm: 'HS256' },
    );
    return token;
}

export function validateJWT(tokenString: string, secret: string) {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as payload;
    } catch (error) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if (decoded.iss !== "chirpy") {
        throw new UserNotAuthenticatedError("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new UserNotAuthenticatedError("No user id in token");
    }

    return decoded.sub;
}

export function getBearerToken(req: Request) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UserNotAuthenticatedError("Malformed Authorization header");
    }
    return extractBearerToken(authHeader);
}

export function extractBearerToken(authHeader: string) {
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new badRequestError("Invalid Authorization header");
    }
    return parts[1];
}

export function makeRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

export function getAPIKey(req: Request) {
    const apiKey = req.get("Authorization");
    if (!apiKey) {
        throw new UserNotAuthenticatedError("Malforemed Authorization header");
    }
    return extractAPIKey(apiKey);
}

export function extractAPIKey(authHeader: string) {
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "ApiKey") {
        throw new badRequestError("Invalid Authorization header");
    }
    return parts[1];
}