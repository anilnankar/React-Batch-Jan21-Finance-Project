const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default("*"),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
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
};

module.exports = env;
