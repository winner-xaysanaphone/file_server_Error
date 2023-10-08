require('dotenv').config()
const mongoose = require('mongoose');
const { ValidationError } = mongoose;
const express = require('express');
const app = express();
const initRoutes = require('./routes/index')
const connectDB = require('./utils/connectDB')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(cookieParser())
app.set('view engine', 'ejs');

//* to not face error: Schema hasn't been registered for model
const fs = require('fs');
// Load all modules in the "folder" directory
fs.readdirSync('./models').forEach(file => {
    if (file.endsWith('.js')) {
        require(`./models/${file}`);
    }
});


connectDB()
initRoutes(app)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/download', (req, res) => res.download(path.join(__dirname, 'public', req.query.file)))

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err?.status || 400).send({ err: err, message: err.message })
});

app.listen(911, () => {
    console.log('Server listening on port 911');
});
