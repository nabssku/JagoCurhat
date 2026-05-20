import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkColumns() {
  try {
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'comments';
    `;
    console.log("Columns in 'comments' table:");
    console.table(result);
  } catch (err) {
    console.error("Error checking columns:", err);
  }
}

checkColumns();
