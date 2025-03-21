# An API in Typescript
A learning project - An API used as a backend for a Social Network like Twitter. 

## Motivation
Motivated to improve my knowledge and skills as a backend developer I feel that a deeper understanding of API and http servers was needed. Hence I've built this.

## Goals

The goal of this project was to get familiar with API's and HTTP servers. Aswell as librarys as JWT, express, drizzle, vitest. 

# Requirement:

Node version:
21.7.0

# Setup:

Setting up the DB

Setup postgressql

Connecting drizzle and postgressql

you need to create a .env file
with:

```
DB_URL="your_connect_string"
PORT = "port"
PLATFORM = "dev"
SECRET = "your-secret-for-JWT"
POLKA_KEY = "apiKey"
```

Your connecting string:
"protocol://username:password@host:port/database?sslmode=disable


run: npm run migrate in cmd line to create tables in your DB
