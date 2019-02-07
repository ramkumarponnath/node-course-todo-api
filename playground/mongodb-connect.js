const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err,client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server ', err);
    }
    console.log('Connect to MongoDB Server');
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
        text: 'test 123',
        completed: true
    },(err,result) => {
        if(err){
            return console.log('Unable to insert todo ', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'Rajani',
        age: 28,
        location: 'Chennai'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert new record ', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })

    client.close();
});