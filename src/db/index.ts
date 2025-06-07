import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: sql });

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import { schema } from "./schema"; // 👈 make sure you have this

// const sql = neon(process.env.DATABASE_URL!);

// // ✅ Correct way to init drizzle with schema
// export const db = drizzle(sql, { schema });
