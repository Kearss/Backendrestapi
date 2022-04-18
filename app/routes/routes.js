//Tuodaan reittien toiminnot erillisestä tiedostosta, jotta ne voidaan liittää mukaan omaan reittiinsä
module.exports = (app) => {
    const music = require("../controller/controller.js")

    //Luodaan reitti kappaleen lisäämiselle
    app.post("/api/add", music.create);

    //Luodaan reitti, joka hakee kaikki kappaleet
    app.get("/api/getall", music.getAll);

    //Luodaan reitti, joka hakee kappaleen ID:n avulla
    app.get("/api/:musicId", music.getById);

    //Luodaan reitti, joka päivittää tietyn kappaleen ID:n avulla toimii vain put postmannissa
    app.put("/api/update/:musicId", music.update);

    //Luodaan reitti, joka poistaa tietyn kappaleen ID:n avulla
    app.delete("/api/delete/:musicId", music.delete)
}