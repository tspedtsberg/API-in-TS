import type { MigrationConfig } from "drizzle-orm/migrator";


type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
  polka: PolkaConfig;
}

//Type to store information about how many times the site as been visited
type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

type JWTConfig = {
  defaultDuration: number;
  secret: string;
  issuer: string;
  refreshDuration: number;
};

type PolkaConfig = {
  polkaKey: string;
}

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db",
}

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),    
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60, // 1hour
    secret: envOrThrow("SECRET"),
    issuer: "chirpy",
    refreshDuration: 60 * 60 * 24 * 30 // 30 days in seconds
  },
  polka: {
    polkaKey: envOrThrow("POLKA_KEY"),
  },
};
