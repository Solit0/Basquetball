const { defineConfig } = require("drizzle-kit");
require("dotenv").config();


module.exports = defineConfig({
  schema: "./models/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Usamos la IP directamente para saltarnos el error de DNS
    url: `postgresql://postgres.xrlwqsrcskuqwcayslax:basketCatolica10@aws-0-us-west-2.pooler.supabase.com:6543/postgres`,
  },
  schemaFilter: ["public"],
});