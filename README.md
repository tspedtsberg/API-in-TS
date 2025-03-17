httpserver in Typescript

requirement:

Node version:
21.7.0

Setup:

Setting up the DB

setup postgressql

connecting drizzle and postgressql

you need to create a .env file
with:

DB_URL="your_connect_string"

Your connecting string:
"protocol://username:password@host:port/database?sslmode=disable


run npx drizzle-kit generate i cmd line to create tables