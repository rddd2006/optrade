// backend/index.js

require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const { Pool } = require('pg');
const cors = require('cors');

// --- CONFIGURATION ---
// IMPORTANT: Update this with your contract's address after you deploy it
const CONTRACT_ADDRESS = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519"; 
// This is the local Anvil/Foundry node. For Sepolia, you'll use a Sepolia RPC URL.
const RPC_URL = "http://127.0.0.1:8545/"; 
const contractABI = require('../contracts/out/OpinionTrade.sol/OpinionTrade.json').abi;

const app = express();
app.use(cors()); // Allows your frontend to connect to this backend
const port = 3001;

// --- DATABASE CONNECTION ---
const pool = new Pool({
  user: 'optrade_user',
  host: 'localhost',
  database: 'optrade_db',
  password: 'optrade_password',
  port: 5432,
});

// --- BLOCKCHAIN LISTENER (INDEXER) ---
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

async function listenToEvents() {
  console.log("Indexer: Listening for blockchain events...");

  contract.on("MarketCreated", async (marketId, question, creator) => {
    console.log(`✅ Event: Market Created | ID: ${marketId}`);
    try {
      await pool.query(
        'INSERT INTO markets (id, question, state) VALUES ($1, $2, 0) ON CONFLICT (id) DO NOTHING',
        [Number(marketId), question]
      );
    } catch (err) {
      console.error("Error saving new market:", err);
    }
  });

  contract.on("BetPlaced", async (marketId, bettor, isYes, amount) => {
    console.log(`✅ Event: Bet Placed on Market ${marketId}`);
    const poolToUpdate = isYes ? 'yes_pool' : 'no_pool';
    // A more robust solution would track unique bettors separately
    const bettorsToUpdate = isYes ? 'yes_bettors' : 'no_bettors';
    try {
      await pool.query(
        `UPDATE markets SET ${poolToUpdate} = ${poolToUpdate} + $1, ${bettorsToUpdate} = ${bettorsToUpdate} + 1 WHERE id = $2`,
        [amount.toString(), Number(marketId)]
      );
    } catch (err) {
      console.error("Error updating bet info:", err);
    }
  });

  contract.on("MarketResolved", async (marketId, outcome) => {
    console.log(`✅ Event: Market Resolved | ID: ${marketId}`);
    try {
        // outcome is an enum: 0: PENDING, 1: RESOLVED_YES, 2: RESOLVED_NO
        await pool.query('UPDATE markets SET state = $1 WHERE id = $2', [outcome, Number(marketId)]);
    } catch(err) {
        console.error("Error updating market resolution:", err);
    }
  });
}

// --- API ENDPOINT ---
app.get('/api/markets', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM markets ORDER BY id DESC');
    // Convert the big numeric values from the DB back to Ether strings
    const markets = rows.map(market => ({
        ...market,
        yes_pool: ethers.formatEther(market.yes_pool || '0'),
        no_pool: ethers.formatEther(market.no_pool || '0'),
    }));
    res.json(markets);
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, async () => {
  console.log(`🚀 OpTrade backend running on http://localhost:${port}`);
  await listenToEvents();
});