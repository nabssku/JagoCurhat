import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  try {
    const result = await sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'comments';
    `;
    console.log("Schema for 'comments' table:");
    console.table(result);
  } catch (err) {
    console.error("Error checking schema:", err);
  }
}

checkSchema();
