// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post('/bookmarks', (req, res) => {
  const { url, title } = req.body;
  if (!title || !url) {
    res.status(422).json({ error: 'required field(s) missing' });
  } else {
    return connection.query('INSERT INTO bookmark SET ?', req.body, (err, results) => {
      if (err) {
        // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
        console.log(err);
        res.status(500).send("Erreur lors de la sauvegarde d'un employé");
      } else {
        const insertId = results.insertId;
        return connection.query('SELECT * FROM bookmark WHERE id = ?', insertId, (err2, records) => {
          if (err2) {
            return res.status(500).send('Error when retrived data from db');
          }

          const { title, url } = records[0];

          return res
            .status(201)
            .json({
              id: insertId, /* id: insertId, */ 
              url: url,
              title: title
            });
  
        });

      }


    });
  }

});

module.exports = app;
