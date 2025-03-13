import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { badRequestError } from "./errors.js";


export async function validate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    
    const MaxChirpyLength = 140;
    if (params.body.length > MaxChirpyLength) {
        throw new badRequestError(`Chirp is too long. Max length is ${MaxChirpyLength}`);
    }
    const words = params.body.split(" ");
    let newWords = [];
    for (const word of words) {
        if (word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax" ) {
            newWords.push("****") 
        } else {
            newWords.push(word);
        }
    }
    const newbody = newWords.join(" ")
    const paramsnew: parameters = {
        body: newbody,
    }

    respondWithJSON(res, 200, { cleanedBody: paramsnew.body });

    /* Koden er ikke nødvendig. express.json() klare det
    let body = '';
    //listens for data and adds its to the variable body
    req.on('data', (chunk) => {
        body += chunk;
    });

    let params: parameters;
    //listens for end and create a response to the request
    req.on('end', () => {
        try {
            params = JSON.parse(body);
        } catch (error) {
            respondWithError(res, 400, "Invalid JSON");
            return;
        }
        const MaxChirpyLength = 140;
        if (params.body.length > MaxChirpyLength) {
            respondWithError(res, 400, "Chirp is too long");
            return;
        }
        respondWithJSON(res, 200, {
            valid: true,
        });
    });
    */
}