const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/index.ejs");
  });

const mongoose = require("mongoose");
//Lisätään tietokannan osoite muuttujaan.
var uri = "mongodb+srv://kears:Password123@cluster0.39rm7.mongodb.net/WEBapplicationRESTAPI?retryWrites=true&w=majority"

//Yhdistetään ohjelma tietokantaan
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log("Connected to the database!")})
.catch(err => {
console.log("Failed to connect to the database.", err)
    process.exit();
})

//Tuodaan reitit erillisestä tiedostosta
require("./app/routes/routes")(app);

//Ohjelma kuuntelee ympäristön määrittämää porttia, tai porttia 8080
app.listen(PORT, () => {
    console.log("Server is running!")
})
