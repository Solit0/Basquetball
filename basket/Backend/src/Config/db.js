const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const dotenv = require("dotenv");
const schema = require("../models/schema.js");

dotenv.config();

console.log('Intentando conectar a Supabase desde:', process.env.DB_HOST);

const queryClient = postgres({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 6543,
  max: 10,
  idle_timeout: 20,
  prepare: false, 
});

const db = drizzle(queryClient, { schema });

const connectDB = async () => {
  try {
    await queryClient`SELECT 1`;
    console.log('Database connection successful a Supabase (CJS) 🚀');
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    process.exit(1);
  }
};

module.exports = { db, connectDB };