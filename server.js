const express = require("express");
const postgres = require("postgres");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function createTable() {
  await sql`DROP TABLE IF EXISTS tickers`;
  await sql`
    CREATE TABLE IF NOT EXISTS tickers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      last TEXT NOT NULL,
      buy TEXT NOT NULL,
      sell TEXT NOT NULL,
      volume TEXT NOT NULL,
      base_unit TEXT NOT NULL,
      quote_unit TEXT NOT NULL
    );
  `;
}

async function fetchAndStoreData() {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = response.data;
    const dynamicTicker = Object.values(tickers).find(
      (ticker) => ticker.base_unit === "btc" && ticker.quote_unit === "inr"
    );

    await sql`TRUNCATE TABLE tickers`;

    if (dynamicTicker) {
      const { name, last, buy, sell, volume, base_unit, quote_unit } =
        dynamicTicker;
      await sql`
        INSERT INTO tickers (name, last, buy, sell, volume, base_unit, quote_unit)
        VALUES ('WizardX', ${last}, ${buy}, ${sell}, ${volume}, ${base_unit}, ${quote_unit})
      `;
    }

    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
}

app.get("/api/tickers", async (req, res) => {
  const { base_unit = "btc", quote_unit = "inr" } = req.query;
  try {
    const result = await sql`
      SELECT * FROM tickers
      WHERE base_unit = ${base_unit} AND quote_unit = ${quote_unit}
      LIMIT 1
    `;
    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

app.use(express.static("public"));

async function startServer() {
  await createTable();
  await fetchAndStoreData();
  setInterval(fetchAndStoreData, 45000);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
