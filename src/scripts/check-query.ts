import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkQuery() {
  try {
    const result = await sql`SELECT image_url FROM comments LIMIT 1`;
    console.log("Success! Data:", result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Query failed with error:", message);
    
    // Check all column names for exact matches
    const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'comments'`;
    console.log("Exact column names:", cols.map(c => `'${c.column_name}'`));
  }
}

checkQuery();
