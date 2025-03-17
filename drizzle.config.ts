import { defineConfig } from "drizzle-kit";
import { config } from "./src/config.ts";

export default defineConfig({
    schema: "src/db/schema/",
    out: "src/db/",
    dialect: "postgresql",
    dbCredentials: {
        url: config.db.url,
    },
});