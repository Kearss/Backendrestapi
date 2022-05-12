const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Otetaan moduuli käyttöön
var mongoose = require("mongoose");
const uri = "mongodb+srv://kears:Nothing1@cluster0.39rm7.mongodb.net/Newbackend?retryWrites=true&w=majority"

// Yhdistetään tietokantaan
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log("Connected to the database!")})
.catch(err => {
console.log("Failed to connect to the database.", err)
    process.exit();
})


// Määritellään Schema, eli tietomalli.
const Music = mongoose.model(
    "music",
    {
        title: String,
        artist: String,
      },
    "music"  // HUOM. Kohdistetaan skeeman operaatiot tähän kokoelmaan
);

// Tämä tarvitaan lomakedatan lukemista varten
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Luodaan reitit ja niiden toiminnallisuudet

/* Tulostetaan kaikki kappaleet */
app.get("/api/musiikit", function (req, res) {
    Music.find({}, function (err, results) {
        /*     Jos tietokantahaussa tapahtuu virhe, palautetaan virhekoodi myös selaimelle */
        if (err) {
            res.json("Järjestelmässä tapahtui virhe", 500);
        }
        /*      Muuten lähetetään tietokannan tulokset selaimelle  */
        else {
            res.json(results, 200);
        }
    });
});

// Lisätään yksi kappale - huomaa POST-muuttujien lukeminen

app.post("/api/lisaa", function (req, res) {
    const newMusic = new Music({
        title: request.body.title,
        artist: request.body.artist,
      });
    
      newMusic.save((err, result) => {
        if (err) {
          response.json("System failure", 500);
        }
    
        response.json(`Saved joke: ${result}`, 200);
      });
    });

/* Muokataan kappale tietoja id-numeron perusteella. Huomaa ID-arvon lukeminen */
app.put("/api/muokkaa/:id", function (req, res) {

    const id = request.params.id;

    Music.findById(id, (err, results) => {
      if (err) {
        response.json("System failure", 500);
      } else if (results === null) {
        response.json("Nothing to update with given id", 200);
      } else {
        results.title = request.body.title;
        results.category = request.body.category;
        results.body = request.body.body;
        results.save((err, result) => {
          if (err) {
            response.json("System failure", 500);
          }
        });
        response.json(`Updated the Joke with id ${id}`);
      }
    });
  });

/* Poistetaan kappale id:n perusteella. Huomaa ID-arvon lukeminen  */

app.delete("/api/poista/:id", function (req, res) {
    // Poimitaan id talteen ja välitetään se tietokannan poisto-operaatioon
    const id = request.params.id;

    Music.findByIdAndDelete(id, (err, results) => {
      if (err) {
        response.json("System failure", 500);
      } else if (results === null) {
        response.json("Nothing to delete with given id", 200);
      } else {
        response.json(`Deleted the Joke with id ${id} and title ${results.title}`, 200);
      }
    });
  });

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function () {
    console.log("Kuunnellaan porttia 8081!");
});