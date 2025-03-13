//Type to store information about how many times the site as been visited
type APIConfig = {
  fileServerHits: number;
  dbURL: string;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: envOrThrow("DB_URL"),
};
