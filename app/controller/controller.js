//Tuodaan tietokannan malli erillisestä tiedostosta
const Music = require("../model/model.js");

//Ensin tarkistetaan onko "title" lisätty. Jos ei, niin annetaan virheviesti.
exports.create = (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            message: "You have to enter the title!"
        });
    }

    //Luodaan uusi kappale
    const music = new Music({
        title: req.body.title,
        artist: req.body.artist
    });

    //Tallennetaan luotu kappale tietokantaan
    music.save()
        .then(oMusic => {
            res.send(oMusic);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occured while creating the new music title."
            });
        });
};

//Haetaan kaikki kappaleet tietokannasta
exports.getAll = (req, res) => {
    Music.find()
        .then(oMusic => {
            res.send(oMusic);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occured while retrieving the data."
            });
        });
};

//Haetaan kappale tietokannasta ID:n avulla. Mikäli annetulla ID:llä ei ole kappaletta tietokannassa tai tapahtuu muu virhe niin niistä saa ilmoituksen
exports.getById = (req, res) => {
    Music.findById(req.params.musicId)
        .then(oMusic => {
            if(oMusic) {
                res.send(oMusic);
            }
            return res.status(404).send({
                message: "No music available with given id" + req.params.musicId
            });
        }).catch(err => {
            if(err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "No music available with given id" + req.params.musicId
                });
            }
            return res.status(500).send({
                message: "Error retrieving music with id" + req.params.musicId
            });
        });
};

//Taas tarkistetaan, että on annettu "title".
exports.update = (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            message: "You have to enter the title!"
        });
    }

    //Etsitään kappale ID:n perusteella ja päivitetään se. Tarkistetaan samat virheet, kuin aikaisemmin.
    Music.findByIdAndUpdate(req.params.musicId, {
        title: req.body.title,
        artist: req.body.artist
    }, {new: true})
        .then(oMusic => {
            if(oMusic) {
                res.send(oMusic);
            }
            return res.status(404).send({
               message: "No music available with given id" + req.params.musicId 
            });
        }).catch(err => {
            if(err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "No music available with given id" + req.params.musicId
                });
            }
            return res.status(500).send({
                message: "Error retrieving music with id" + req.params.musicId
            });
        }); 
};

//Poistetaan kappale ID:n perusteella. Tarkastetaan samat virheet, kuten aikaisemmin.
exports.delete = (req, res) => {
    Music.findByIdAndRemove(req.params.musicId)
        .then(oMusic => {
            if(oMusic) {
                res.send({message: "Music title has been deleted!"});
            }
            return res.status(404).send({
                message: "No music available with given id" + req.params.musicId
            });
        }).catch(err => {
            if(err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "No music available with given id" + req.params.musicId
                });
            }
            return res.status(500).send ({
                message: "Error retrieving music with id" + req.params.musicId
            });
        });
};