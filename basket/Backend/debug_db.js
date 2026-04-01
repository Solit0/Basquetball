const postgres = require('postgres');

const connectionString = "postgresql://postgres:basketCatolica10@db.xrlwqsrcskuqwcayslax.supabase.co:5432/postgres?sslmode=require";
const sql = postgres(connectionString);

async function check() {
  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log("--- TABLAS ENCONTRADAS EN SUPABASE ---");
    console.table(result);
    process.exit();
  } catch (err) {
    console.error("--- ERROR DE CONEXIÓN ---");
    console.error(err.message);
    process.exit(1);
  }
}

check();