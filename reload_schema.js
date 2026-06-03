const { Client } = require("pg");

async function reloadSchema() {
  const connectionString = "postgresql://postgres.aqyqkwihhdibvwiswdrw:K@001rishil001@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres";
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database successfully.");
    
    // Notify PostgREST to reload the schema cache
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log("Schema cache reloaded successfully.");
  } catch (error) {
    console.error("Error reloading schema:", error);
  } finally {
    await client.end();
  }
}

reloadSchema();
