import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { badRequestError } from "./errors.js";
import { CreateChirp, getChirps } from "../db/queries/chirps.js";


export async function handlerCreateChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    const cleaned = validate(params.body);
    const chirp = await CreateChirp({body: cleaned, userId: params.userId});

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