var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date?", (req, res) => {
  let date = req.params.date || new Date();
    
  if (!(date instanceof Date) && !date.includes("-")) {
    date = parseInt(date);
  }

  let unix = new Date(date).getTime();
  let utc = new Date(date).toUTCString();
  let obj =
    utc == "Invalid Date"
      ? { error: "Invalid Date" }
      : { unix: unix, utc: utc };

  res.json(obj);
});

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});