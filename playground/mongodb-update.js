const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err,client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server ', err);
    }
    console.log('Connect to MongoDB Server');
    const db = client.db('TodoApp');

    
    /* db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5c5ec8d9c0e72808ac10f0b0")
    }, {
        $set:{
            completed: true
        }
    }, {
        returnOriginal : false
    }).then(result => {
        console.log(result);
    }); */

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5c5ecb8903a47e06d8caad37")
    }, {
        $set:{
            name: 'Rajani'
        },
        $inc: {
            age: -4
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    }, error => {
        console.log(error);
    });

    client.close();
});