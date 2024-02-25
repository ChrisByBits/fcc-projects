require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env["DB_URL"]);

const urlSchema = new mongoose.Schema({
  original_url: { type: String, unique: true, required: true },
  short_url: { type: Number, unique: true, required: true },
});
const Url = mongoose.model("urls", urlSchema);

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use("/", bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async(req, res) => {
  try {
  const urlRegex = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
  
  const originalUrl = req.body.url;

  if(!urlRegex.test(originalUrl))
    return res.json({ error: "invalid url" });
  
  let existingUrl = await Url.findOne({ original_url: originalUrl });

  if (existingUrl) 
    return res.json({ original_url: existingUrl.original_url, short_url: existingUrl.short_url });
    
  const lastUrl = await Url.findOne({}).sort({ short_url: -1 });
  const shortUrl = lastUrl ? parseInt(lastUrl.short_url) + 1 : 1;
  
  const newUrl = new Url({
    original_url: originalUrl,
    short_url: shortUrl,
  });
  const savedUrl = await newUrl.save();

  res.json({original_url: savedUrl.original_url, short_url: savedUrl.short_url});
  } catch (error) {
    console.error("Error handling short URL creation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/shorturl/:short", async (req, res) => {
  const shortUrl = req.params.short;
  try {
    const url = await Url.findOne({ short_url: shortUrl });
    if (!url) 
      return res.status(404).json({ error: "No short URL found for the given input" });
    res.redirect(url.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost/${port}/`);
});
