import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { badRequestError, notFoundError, userForbiddenError } from "./errors.js";
import { CreateChirp, getChirps, getChirp, deleteChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";



export async function handlerCreateChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);

    const cleaned = validate(params.body);
    const chirp = await CreateChirp({body: cleaned, userId: userId});

    respondWithJSON(res, 201, chirp);
}
function validate(body: string) {
    const MaxChirpyLength = 140;
    if (body.length > MaxChirpyLength) {
        throw new badRequestError(`Chirp is too long. Max length is ${MaxChirpyLength}`);
    }

    return getCleanedBody(body);
}

function getCleanedBody(body: string) {
    const words = body.split(" ");
    let newWords = [];
    
    for (const word of words) {
        if (word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax" ) {
            newWords.push("****") 
        } else {
            newWords.push(word);
        }
    }
    const newbody = newWords.join(" ")
    return newbody;
}

//"/api/chirps"
export async function handlergetAllChirps(req: Request, res: Response) {
    const chirps = await getChirps();
    respondWithJSON(res, 200, chirps)
}

export async function handlergetChirp(req: Request, res: Response) {
    const { chirpId } = req.params;

    const chirp = await getChirp(chirpId);

    if (!chirp) {
        throw new notFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
   
    const { chirpId } = req.params;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new notFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    if (chirp.userId !== userId) {
        throw new userForbiddenError("You are not authorized to delete this chirp");
    }

    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }

    res.status(204).send();
}