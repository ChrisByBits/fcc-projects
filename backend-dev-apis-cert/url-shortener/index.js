require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env["DB_URL"]);

const urlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: { type: Number, required: true },
});
const Url = mongoose.model("urls", urlSchema);

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use("/", bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const originalUrl = req.body.url;
  try {
    new URL(originalUrl);
  } catch {
    return res.json({ error: "invalid url" });
  }

  try {
    let existingUrl = await Url.findOne({ original: originalUrl });

    if (existingUrl) 
      return res.json({ original: existingUrl.original, short: existingUrl.short });

    const lastUrl = await Url.findOne({}).sort({ short: -1 });
    const shortUrl = lastUrl ? lastUrl.short + 1 : 1;
    const newUrl = new Url({
      original: originalUrl,
      short: shortUrl,
    });
    const savedUrl = await newUrl.save();
    res.json({original: savedUrl.original, short: savedUrl.short});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/shorturl/:short", async (req, res) => {
  const shortUrl = req.params.short;
  try {
    const url = await Url.findOne({ short: shortUrl });
    if (!url) 
      return res.status(404).json({ error: "No short URL found for the given input" });
    res.redirect(url.original);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost/${port}/`);
});
