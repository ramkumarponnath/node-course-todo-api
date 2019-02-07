const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err,client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server ', err);
    }
    console.log('Connect to MongoDB Server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     "_id": new ObjectID("5c5971c23b183d12885d4494")
    // }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch Todos ', err);
    // });

    db.collection('Todos').find({
        "completed" : false
    }).count().then((count) => {
        console.log(`Todos Count ${count}`);
    }, (err) => {
        console.log('Unable to fetch Todos ', err);
    });

    client.close();
});