# A RESTful API in Typescript
Project is finished.

## Goals

The goal of this project was to get familiar with API's and HTTP servers. Aswell as librarys as JWT, express, drizzle, vitest. 

Requirement:

Node version:
21.7.0

## Setup:

Setting up the DB

Setup postgressql

Connecting drizzle and postgressql

you need to create a .env file
with:

DB_URL="your_connect_string"
PORT = "port"
PLATFORM = "dev"
SECRET = "your-secret-for-JWT"
POLKA_KEY = "apiKey"

Your connecting string:
"protocol://username:password@host:port/database?sslmode=disable


run: <npm run migrate> in cmd line to create tables in your DB
