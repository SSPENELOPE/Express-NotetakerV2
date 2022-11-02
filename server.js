const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const notes = require('./db/db.json');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves Homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Retrieves Notes Page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Retrieves Pre-existing Notes
 app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf8', function(err, data){
        if(err) {
            console.log(err);
            return;
        } else {
            res.json(notes);
        }
   })
);

// Writes Notes to the JSON File
app.post('/api/notes', function (req,res) {
    let letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let id = letter + Date.now();
    let note = {
        id: id,
        title: req.body.title,
        text: req.body.text,
    };
    notes.push(note);
    let noted = JSON.stringify(notes);
    res.json(notes);

    fs.writeFile('db/db.json', noted, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log('Note Saved');
        };
    });
});

// Tells the application to listen on the designated port
app.listen(PORT, () => console.log(`APP LISTENING ON localhost:${PORT}`));
// Adding this for heroku