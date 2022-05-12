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

const MusicSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: String
}, 
{
    timestamps: true
});
// Määritellään Schema, eli tietomalli.
const Music = mongoose.model(
    "music",
    MusicSchema,
    "music"  // HUOM. Kohdistetaan skeeman operaatiot tähän kokoelmaan
);

// Tämä tarvitaan lomakedatan lukemista varten
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Luodaan reitit ja niiden toiminnallisuudet

/* Tulostetaan kaikki kappaleet */
app.get("/api/musiikit", function (req, res) {
    Music.find({}, null, { limit: 20 }, function (err, results) {
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
    var title = req.body.title;
    var artist = req.body.artist;

    const music = new Music({
        title: req.body.title,
        artist: req.body.artist
    });
    console.log(music);
    music.save();

    res.send("Lisätään kappale: " + req.body.title );
});

/* Muokataan kappale tietoja id-numeron perusteella. Huomaa ID-arvon lukeminen */
app.put("/api/muokkaa/:id", function (req, res) {

    var id = req.params.id;

    Music.findByIdAndUpdate(id, { title: 'Tänne uusi nimi' }, function (err, results) {
        /*     Jos tietokantahaussa tapahtuu virhe, palautetaan virhekoodi myös selaimelle */
        if (err) {
            res.json("Järjestelmässä tapahtui virhe", 500);
        }
        /*      Muuten lähetetään tietokannan tulokset selaimelle  */
        else {
            res.json("Muokattiin kappaleen id:llä: " + req.params.id + " nimeltään: " + results.title);
        }
    });
});

/* Poistetaan kappale id:n perusteella. Huomaa ID-arvon lukeminen  */

app.delete("/api/poista/:id", function (req, res) {
    // Poimitaan id talteen ja välitetään se tietokannan poisto-operaatioon
    var id = req.params.id;

    Music.findByIdAndDelete(id, function (err, results) {
        /*         Tietokantavirheen käsittely  */
        if (err) {
            console.log(err);
            res.json("Tietokantajärjestelmävirhe. Yritä hetken kuluttua uudestaa...", 500);
        }
        /*       Tietokanta ok, mutta poistettavaa ei löydy. Onko kyseessä virhe vai ei on semantiikkaa */
        else if (results == null) {
            res.json("Poistetavaa dokumenttia ei löytynyt.", 200);
        } // Viimeisenä tilanne jossa kaikki ok
        else {
            console.log(results);
            res.json("Deleted " + id + " " + results.title, 200);
        }
    });
});

// Web-palvelimen luonti Expressin avulla
app.listen(8081, function () {
    console.log("Kuunnellaan porttia 8081!");
});