const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default("*"),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().min(1),
  DB_POOL_LIMIT: z.coerce.number().int().positive().default(10),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:", parsedEnv.error.flatten());
  process.exit(1);
}

const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  corsOrigin: parsedEnv.data.CORS_ORIGIN,
  apiRateLimitWindowMs: parsedEnv.data.API_RATE_LIMIT_WINDOW_MS,
  apiRateLimitMax: parsedEnv.data.API_RATE_LIMIT_MAX,
  dbHost: parsedEnv.data.DB_HOST,
  dbPort: parsedEnv.data.DB_PORT,
  dbUser: parsedEnv.data.DB_USER,
  dbPassword: parsedEnv.data.DB_PASSWORD,
  dbName: parsedEnv.data.DB_NAME,
  dbPoolLimit: parsedEnv.data.DB_POOL_LIMIT,
};

module.exports = env;
