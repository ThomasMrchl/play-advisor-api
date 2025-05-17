const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
require('./database/mysql.db')

const gameRoutes = require('./routes/game')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Setup routes before starting the server
app.use('/game', gameRoutes);
app.use('/review', reviewRoutes);
app.use('/user', userRoutes);

app.all('/{*any}', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

module.exports = app; 