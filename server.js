// Dependancies required for the application:
const express = require('express');
const path = require('path');
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// Port decided by the domain, otherwise use 3001
const port = process.env.PORT || 3001;

// Set up the express by assigning it to app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Route for getting user to the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Route that displays info from db.json (note API data)
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

// Route for getting user to the index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Takes a JSON input with keys "title" and "text" and adds a new note object with that message to the db.json file
app.post('/api/notes', (req, res) => {
    // First we read the db file for current notes...
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, response) => {
        if (err) {
            console.log(err);
        }

        // Declare variables for notes and note properties
        let notes = JSON.parse(response);
        let noteRequest = req.body;
        let newNote = {
            id: uuid(),
            title: noteRequest.title,
            text: noteRequest.text
        };

        // Add new note to db
        notes.push(newNote);
        res.json(newNote);
        // Then update db file to include change
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (error) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log('Note added successfully!');
            }
        });
    });
});

// Deletes the note object with requested id from the db.json file
app.delete('/api/notes/:id', function (req, res) {
    // First we read the db file for current notes...
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, response) => {
        if (err) {
            console.log(err);
        }

        // Declare variable for notes
        let notes = JSON.parse(response);

        // Delete note based on ID
        res.json(notes.splice(req.params.id, 1));
        // Then update db file with new changes (deleted note)
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (error) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log('Note deleted successfully.');
            }
        });
    });
});

app.listen(port, () =>
    console.log(`App currently listening on port ${port} 🚀`)
);