var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:input?", (req, res) => {
  let input = req.params.input || new Date();
    
  let date = new Date(input);

  if (isNaN(date.getTime()) && !isNaN(input)) 
      date = new Date(parseInt(input));
  
  if (isNaN(date.getTime())) 
      return res.json({ error: "Invalid Date" });  
  
  let unix = date.getTime();
  let utc = date.toUTCString();
  let obj = { unix: unix, utc: utc };
  res.json(obj);
});

var listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
