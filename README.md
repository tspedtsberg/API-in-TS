httpserver in Typescript

requirement:

Node version:
21.7.0

Setup:

Setting up the DB

setup postgressql

connecting drizzle and postgressql

you need to create config file
I named mine: drizzle.config.ts

It should contain the following:

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "src/<path_to_schema>",
    out: "src/<path_to_generated_files>",
    dialect: "postgresql",
    dbCredentials: {
        url: "your_connection_string",
    },
});

Your connecting string:
"protocol://username:password@host:port/database?sslmode=disable

run npx drizzle-kit generate i cmd line to create tables