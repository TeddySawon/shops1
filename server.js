// server.js (Node.js + Express)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/barang", async (req, res) => {
  const response = await fetch("https://mepriceapi.vercel.app/barang/");
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server proxy berjalan di port 3000"));
