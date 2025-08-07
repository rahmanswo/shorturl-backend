require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const { isWebUri } = require("valid-url");

//mongodb connection
const connection = mongoose.connection;
connection.on("error", console.log.bind(console, "connection error: "));
connection.once("open", () => {
  console.log("mongodb success");
});
const uri = process.env.MONGO_URI || $MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: String,
});
const URL = mongoose.model("URL", urlSchema);

//basic configuration
const port = process.env.PORT || $PORT;

app.use(cors());
app.use(bodyParser.json());

app.route("/").get((req, res) => {
  res.send("info fatkhurrahman.fatkhurrahman@softwareone.com");
});

//api
app.route("/api/shorturl/").post(async (req, res) => {
  const url = req.body.url;
  let urlCode = nanoid(7);
  console.log(url);
  //validasi url
  if (!validUrl.isWebUri(url)) {
    res.status(400).json({
      error: "invalid url",
    });
  } else {
    //cari data
    try {
      let Data = await URL.findOne({
        original_url: url,
      });
      if (Data) {
        res.json({
          original_url: Data.original_url,
          short_url: Data.short_url,
        });
      } else {
        //membuat data
        Data = new URL({
          original_url: url,
          short_url: urlCode,
        });
        await Data.save();
        res.json({
          original_url: Data.original_url,
          short_url: Data.short_url,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }
  }
});

app.route("/:url").get(async (req, res) => {
  try {
    let urlParams = await URL.findOne({
      short_url: req.params.url,
    });
    console.log(req.params.url);
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});
// random = () => {
//   let a = nanoid(5);
//   return a;
// };

// console.log(random());

//listen
app.listen(port);
