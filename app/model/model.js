const mongoose = require("mongoose");

//Luodaan skeema, joka määrittää, missä muodossa data tulee viedä tietokantaan
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

module.exports = mongoose.model("Music", MusicSchema);