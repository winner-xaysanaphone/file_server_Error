
const mongoose = require('mongoose');
const uri = process.env.DB_URI;
console.log(uri)
module.exports = () => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.error(error));
}
