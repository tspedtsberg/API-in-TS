import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

//added the .js fileextension or the import fails when compiled
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateChirps, handlergetAllChirps, handlergetChirp, handlerDeleteChirp } from "./api/chirps.js";
import { config } from "./config.js";
import { 
    handleCreateUser,
    handleLogin,
    handlerRefresh,
    handlerRevoke,
    handlerUpdateUser,
    handlerMakeUserChirpyRed
 } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

//tells express to server files from the current directory
//also run the functions when the path is called
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses)
app.use(express.json());


//get(path hvorpå function bliver kaldt)
app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    }  catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerMetrics(req, res);
    }  catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    }  catch (err) {
        next(err);
    }
});

app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerCreateChirps(req, res);
    }  catch (err) {
        next(err);
    }
});

app.post("/api/users", async (req, res, next) => {
    try {
        await handleCreateUser(req, res);
    }  catch (err) {
        next(err);
    }
});

app.post("/api/login", async (req, res, next) => {
    try {
        await handleLogin(req, res);
    }  catch (err) {
        next(err);
    }
});
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next);
  });

app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(handlerRevoke(req, res)).catch(next);
  });

app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlergetAllChirps(req, res);
    } catch (err) {
        next(err);
    }
});

app.get("/api/chirps/:chirpId", async (req, res, next) => {
    try {
        await handlergetChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});

app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
  });
  
app.post("/api/polka/webhooks", (req, res, next) => {
    Promise.resolve(handlerMakeUserChirpyRed(req, res)).catch(next);
});




app.use(middlewareErrorHandler)

//starts the server and listen for incoming connects on the port specified
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}/app`);
});
