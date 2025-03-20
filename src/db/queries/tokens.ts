import { NewRefreshToken } from "../schema/schema.js";
import { db } from "../index.js";
import { refresh_tokens } from "../schema/schema.js";
import { config } from "../../config.js";


export async function saveRefreshToken(userId: string, token: string) {
    const rows = await db.insert(refresh_tokens).values({
        user_id: userId,
        token: token,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
        revokedAt: null,
    }).returning();

    return rows.length > 0
}

export async function userForRefreshToken(token: string) {
    
}