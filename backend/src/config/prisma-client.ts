import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
  prismaAdapter?: PrismaPg;
};

function shouldUseSsl(connectionString: string): boolean {
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode")?.toLowerCase();
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

  if (sslMode === "disable") {
    return false;
  }

  if (sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full") {
    return true;
  }

  if (process.env.PGSSLMODE?.toLowerCase() === "disable") {
    return false;
  }

  if (process.env.PGSSLMODE?.toLowerCase() === "require") {
    return true;
  }

  if (process.env.DATABASE_SSL?.toLowerCase() === "true") {
    return true;
  }

  // Default behavior: local databases usually run without TLS, while hosted
  // PostgreSQL providers typically require TLS regardless of NODE_ENV.
  return !isLocalHost;
}

// Neon-optimized pool configuration
// Neon pooler endpoint already handles connection pooling,
// so we use modest settings to avoid overwhelming it
const pgPool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: env.databaseUrl,
    ssl: shouldUseSsl(env.databaseUrl)
      ? {
          rejectUnauthorized: false
        }
      : undefined,
    max: 5, // Small pool - Neon's pooler handles the rest
    min: 1,
    idleTimeoutMillis: 120000, // 2 minutes - longer for Neon
    connectionTimeoutMillis: 45000, // 45 seconds
    statement_timeout: 45000,
    query_timeout: 45000,
    // Reduce connection churn
    application_name: 'ae-website-backend',
  });

export { pgPool };

const prismaAdapter = globalForPrisma.prismaAdapter ?? new PrismaPg(pgPool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: prismaAdapter,
    log: ["error", "warn"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pgPool;
  globalForPrisma.prismaAdapter = prismaAdapter;
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing database connections...");
  await pgPool.end();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing database connections...");
  await pgPool.end();
  await prisma.$disconnect();
  process.exit(0);
});
