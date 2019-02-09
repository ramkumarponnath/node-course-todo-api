const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err,client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server ', err);
    }
    console.log('Connect to MongoDB Server');
    const db = client.db('TodoApp');

    db.collection('Todos').deleteOne({
        name: 'Rajani'
    }).then(result => console.log(result));

    db.collection('Todos').deleteMany({
        name: 'Rajani'
    }).then(result => console.log(result));

    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID("5c5971c23b183d12885d4494")
    }).then(result => console.log(result));

    client.close();
});