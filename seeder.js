
const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");


/**
 * constants
 */
// const uri = "mongodb://localhost:27017/focus";
const uri = "mongodb+srv://admin:hkHg9xpbAg2cNY4@cluster0.kh98s.mongodb.net/focus?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true });

async function main() {
  try {
    await client.connect();
    const db = client.db();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    load.stop();

    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
