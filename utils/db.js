const {MongoClient} = require('mongodb');

// połączenie do bazy
const client = new MongoClient('mongodb://localhost:27017');
client.connect();

const db = client.db('megak_todo'); // wybór bazy danych

const todos = db.collection('todos'); // przypisanie kolekcji do zmiennej (będziemy korzystać z jednej kolekcji więc łatwiej będzie ją przypisać do zmiennej i korzystac tylko z todos)

module.exports = {
    db,
    todos,
    client,
};