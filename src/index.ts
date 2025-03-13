import express from "express";
//added the .js fileextension or the import fails when compiled
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { validate } from "./api/validate.js";


const app = express();
const PORT = 8080

//tells express to server files from the current directory
//also run the functions when the path is called
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses)
app.use(express.json());

//get(path hvorpå function bliver kaldt)
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", validate)




//starts the server and listen for incoming connects on the port specified
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
});
