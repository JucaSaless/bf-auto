const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/db_bfauto");
mongoose.connect("mongodb+srv://admin:2yFJn4r7l5ocdAQZ@cluster0.b3xo2sz.mongodb.net/?retryWrites=true&w=majority");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// const mongoClient = require('mongodb').MongoClient;
// mongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true },
// (error, connection) => {
//     if(error) console.log('Database connected ERROR: \n' + error.message);
//     else { 
//         global.connection = connection.db('bfautodb');    
//         console.log('Database Connected');
//     }
// });

module.exports = {};
