const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err,client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server ', err);
    }
    console.log('Connect to MongoDB Server');
    const db = client.db('TodoApp');

    db.collection('Todos').drop()
        .then(result => {
            console.log('Collection dropped');
        }, error => {
            console.log(`Error ${error}`)
        });

    db.collection('Users').drop()
        .then(result => {
            console.log('Collection dropped');
        }, error => {
            console.log(`Error ${error}`)
        });

    //client.close();
});